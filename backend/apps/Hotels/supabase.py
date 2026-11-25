import logging
import uuid
import re
from pathlib import Path
from django.conf import settings

logger = logging.getLogger(__name__)

# Module-level cache for Supabase client
_supabase_client = None
_supabase_bucket = None


DEFAULT_SUPABASE_URL = "https://dgsttpexaemtfsqdiept.supabase.co"
DEFAULT_BUCKET_NAME = "menu-images"


def _sanitize_supabase_url(url):
    """
    Sanitize Supabase URL to prevent Invalid URL exceptions.
    Handles quotes, accidental database URLs, leading/trailing whitespace, and missing schemes.
    """
    if not url:
        return DEFAULT_SUPABASE_URL
    url = str(url).strip().strip("'\"").strip()
    if url.startswith(('postgres://', 'postgresql://')):
        # Database URL was mistakenly entered as SUPABASE_URL
        return DEFAULT_SUPABASE_URL
    if not url.startswith(('http://', 'https://')):
        url = f"https://{url}"
    return url.rstrip('/')


def _sanitize_supabase_key(key):
    """
    Sanitize Supabase key string, stripping quotes and whitespace.
    """
    if not key:
        return ""
    return str(key).strip().strip("'\"").strip()


def get_supabase_client():
    """
    Safely retrieve or initialize the Supabase client and storage bucket.
    Sanitizes URL and credentials to prevent Invalid URL crashes.
    """
    global _supabase_client, _supabase_bucket

    if _supabase_bucket is not None:
        return _supabase_client, _supabase_bucket

    raw_url = getattr(settings, 'SUPABASE_URL', '')
    raw_key = getattr(settings, 'SUPABASE_SECRET_KEY', '')
    raw_bucket = getattr(settings, 'SUPABASE_BUCKET_NAME', DEFAULT_BUCKET_NAME)

    supabase_url = _sanitize_supabase_url(raw_url)
    supabase_key = _sanitize_supabase_key(raw_key)
    bucket_name = str(raw_bucket).strip().strip("'\"") if raw_bucket else DEFAULT_BUCKET_NAME

    if not supabase_key:
        logger.error(
            "SUPABASE_SECRET_KEY is missing from environment settings. "
            "Please configure SUPABASE_SECRET_KEY in Render Environment Variables."
        )
        return None, None

    try:
        from supabase import create_client
        _supabase_client = create_client(supabase_url, supabase_key)
        _supabase_bucket = _supabase_client.storage.from_(bucket_name)
        return _supabase_client, _supabase_bucket
    except Exception as e:
        logger.error(f"Could not connect to Supabase Storage with {supabase_url}: {e}")
        return None, None


def upload_image_to_supabase(file_obj, folder="menu"):
    """
    Upload an image file to Supabase Storage.
    Validates file type and size.
    Returns the public URL of the uploaded image.
    Falls back gracefully to local media storage if external network or Supabase is unreachable.
    """
    if not file_obj:
        return ""

    # Validate file size (max 10MB)
    if hasattr(file_obj, 'size') and file_obj.size > 10 * 1024 * 1024:
        raise ValueError("Image file size exceeds the 10MB limit.")

    # Validate content type
    content_type = getattr(file_obj, 'content_type', 'image/jpeg')
    if not content_type.startswith('image/'):
        raise ValueError("Uploaded file must be a valid image (JPEG, PNG, WEBP, etc.).")

    # Read and validate bytes
    if hasattr(file_obj, 'seek'):
        file_obj.seek(0)
    file_bytes = file_obj.read()

    if not file_bytes:
        raise ValueError("Uploaded image file is empty.")

    # Clean file name
    orig_name = getattr(file_obj, 'name', 'image.jpg')
    clean_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', orig_name)
    unique_filename = f"{uuid.uuid4().hex[:12]}_{clean_name}"
    storage_path = f"{folder}/{unique_filename}"

    # Try uploading to Supabase Storage
    _, bucket = get_supabase_client()
    if bucket:
        try:
            bucket.upload(
                path=storage_path,
                file=file_bytes,
                file_options={"content-type": content_type}
            )
            public_url = bucket.get_public_url(storage_path)
            if public_url:
                logger.info(f"Uploaded image to Supabase: {public_url}")
                return public_url
            raise Exception("Supabase returned empty public URL after upload.")
        except Exception as e:
            logger.error(f"Supabase upload failed: {e}")
            # Re-raise so the view returns a clear error to the admin.
            # Silently falling back to local media produces inaccessible URLs
            # on production (Render's ephemeral filesystem / different domain).
            raise Exception(f"Image upload to cloud storage failed: {e}") from e

    # Supabase not configured — do NOT fall back to local media on production.
    # Local media is ephemeral on Render and not served cross-domain to yaba.site.
    logger.error(
        "Supabase storage is not configured (SUPABASE_URL / SUPABASE_SECRET_KEY missing). "
        "Image upload cannot proceed without cloud storage."
    )
    raise Exception(
        "Cloud storage is not configured on this server. "
        "Please contact the administrator to set SUPABASE_URL, SUPABASE_SECRET_KEY, "
        "and SUPABASE_BUCKET_NAME environment variables."
    )


def delete_image_from_supabase(image_url):
    """
    Delete an image from Supabase Storage by its public URL or from local media.
    Handles missing images and network errors gracefully.
    """
    if not image_url:
        return False

    _, bucket = get_supabase_client()
    bucket_name = getattr(settings, 'SUPABASE_BUCKET_NAME', 'menu-images')

    try:
        # Check if URL belongs to Supabase bucket
        bucket_marker = f"/{bucket_name}/"
        if bucket and bucket_marker in image_url:
            path_part = image_url.split(bucket_marker)[-1]
            bucket.remove([path_part])
            logger.info(f"Deleted image from Supabase: {path_part}")
            return True

        # Check if local media fallback
        if image_url.startswith(settings.MEDIA_URL):
            rel_path = image_url[len(settings.MEDIA_URL):]
            local_path = Path(settings.MEDIA_ROOT) / rel_path
            if local_path.exists():
                local_path.unlink()
                logger.info(f"Deleted local fallback image: {local_path}")
                return True
    except Exception as e:
        logger.warning(f"Failed to delete image: {e}")

    return False
