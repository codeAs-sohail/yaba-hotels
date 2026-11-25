/**
 * Resolves the backend API base URL using Vite environment variables.
 * Prioritizes import.meta.env.VITE_API_URL, then falls back to VITE_API_BASE_URL.
 * Automatically normalizes trailing slashes and ensures the path routes to `/api/`.
 *
 * Supported formats:
 * - https://yaba-backend.onrender.com -> https://yaba-backend.onrender.com/api/
 * - https://yaba-backend.onrender.com/api -> https://yaba-backend.onrender.com/api/
 * - https://yaba-backend.onrender.com/api/ -> https://yaba-backend.onrender.com/api/
 * - /api/ -> /api/
 * - undefined / empty -> /api/ (defaults to relative proxy)
 */
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (!envUrl) return "/api/";

  const trimmed = envUrl.trim().replace(/\/+$/, "");
  if (trimmed.endsWith("/api")) {
    return `${trimmed}/`;
  }
  if (trimmed === "/api" || trimmed === "") {
    return "/api/";
  }
  return `${trimmed}/api/`;
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Resolves full public URL for media images.
 * If image is hosted on Supabase (full URL), returns as is.
 * If image is stored in local media (/media/...), prepends backend origin to avoid 404 on frontend static host.
 */
export const resolveImageUrl = (url) => {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  const apiBase = getApiBaseUrl();
  const backendHost = apiBase.replace(/\/api\/?$/, '').replace(/\/+$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return backendHost ? `${backendHost}${cleanPath}` : cleanPath;
};
