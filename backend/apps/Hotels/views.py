import logging
from django.db import transaction
from django.db.models import Count
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from .models import Category, Branch, Menu, OnlinePlatforms, Gallery, Feedback
from .serializers import (
    CategorySerializer,
    BranchSerializer,
    MenuSerializer,
    OnlinePlatformsSerializer,
    GallerySerializer,
    FeedbackSerializer,
)

from .supabase import upload_image_to_supabase, delete_image_from_supabase
logger = logging.getLogger(__name__)

class LogoutView(APIView):
    
    """
    Log out user by blacklisting the provided refresh token.
    """
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"error": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Successfully logged out."},
                status=status.HTTP_200_OK,
            )
        except TokenError as e:
            return Response(
                {"error": f"Invalid or expired token: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


# ==============================================================================
# MENU MANAGEMENT APIS
# ==============================================================================

class MenuListCreateView(generics.ListCreateAPIView):
    """
    GET /api/menu/?branch_id=<id> - List menu items (supports branch filtering). Publicly accessible.
    POST /api/menu/ - Create a menu item with image upload and delivery platform links (owners only).
    """
    serializer_class = MenuSerializer

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = (
            Menu.objects.select_related('branch', 'category')
            .prefetch_related('online_platforms')
            .order_by('-created_at')
        )
        branch_id = self.request.query_params.get('branch_id')
        if branch_id and branch_id not in ('all', 'undefined', 'null'):
            try:
                queryset = queryset.filter(branch_id=int(branch_id))
            except (ValueError, TypeError):
                queryset = queryset.none()
        return queryset

    @transaction.atomic #->If anything fails during transaction it gets rollback 
    def create(self, request, *args, **kwargs):
        data = request.data.copy()#copy because->Because we may need to modify this data before passing it to the serializer.

        # Handle file upload to Supabase or fallback
        image_file = request.FILES.get('image')
        if image_file:
            try:
                uploaded_url = upload_image_to_supabase(image_file, folder="menu")
                data['image'] = uploaded_url #storing image url in image field so that when we save it , it gets save in DB
            except ValueError as ve:
                return Response({'error': str(ve)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.error(f"Image upload failed: {e}")
                data['image'] = ''

        # Validate and serialize Menu
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        menu_item = serializer.save()

        # Extract platform delivery links
        zomato = request.data.get('zomato', '').strip()
        swiggy = request.data.get('swiggy', '').strip()
        ownly = request.data.get('ownly', '').strip()

        if zomato or swiggy or ownly:
            OnlinePlatforms.objects.create(
                branch=menu_item.branch,
                item=menu_item,
                zomato=zomato,
                swiggy=swiggy,
                ownly=ownly,
            )   

        # Refresh from DB with relations
        output_serializer = self.get_serializer(menu_item)
        headers = self.get_success_headers(output_serializer.data)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class MenuDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/menu/<id>/ - Retrieve single menu item. Publicly accessible.
    PATCH/PUT /api/menu/<id>/ - Update menu item details, replace image, and sync platform links (owners only).
    DELETE /api/menu/<id>/ - Delete menu item, cascade platform links, and delete Supabase image (owners only).
    """
    serializer_class = MenuSerializer
    queryset = Menu.objects.select_related('branch', 'category').prefetch_related('online_platforms')

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()#PATCH /api/menu/15/-> get the object with id = 15 
        data = request.data.copy()

        old_image_url = instance.image
        new_image_uploaded = False


        # Handle image replacement
        image_file = request.FILES.get('image')
        if image_file:
            try:
                uploaded_url = upload_image_to_supabase(image_file, folder="menu")
                data['image'] = uploaded_url
                new_image_uploaded = True
            except ValueError as ve:
                return Response({'error': str(ve)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        menu_item = serializer.save()

        # If image updated successfully, remove old image
        if new_image_uploaded and old_image_url and old_image_url != menu_item.image:
            delete_image_from_supabase(old_image_url)

        # Update or create delivery platform links if provided in request
        #any() returns True if at least one condition is true.

        has_platform_data = any(k in request.data for k in ['zomato', 'swiggy', 'ownly'])
        if has_platform_data:
            platform = OnlinePlatforms.objects.filter(item=menu_item).first()
            if not platform:
                platform = OnlinePlatforms(branch=menu_item.branch, item=menu_item)

            platform.branch = menu_item.branch
            if 'zomato' in request.data:
                platform.zomato = request.data.get('zomato', '').strip()
            if 'swiggy' in request.data:
                platform.swiggy = request.data.get('swiggy', '').strip()
            if 'ownly' in request.data:
                platform.ownly = request.data.get('ownly', '').strip()

            platform.save()

        output_serializer = self.get_serializer(menu_item)
        return Response(output_serializer.data)

    @transaction.atomic
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        image_url = instance.image

        # Delete database object (cascade automatically deletes OnlinePlatforms)
        instance.delete()

        # Safely remove image from storage
        if image_url:
            delete_image_from_supabase(image_url)

        return Response(status=status.HTTP_204_NO_CONTENT)


# ==============================================================================
# GALLERY MANAGEMENT APIS
# ==============================================================================

class GalleryListCreateView(generics.ListCreateAPIView):
    """
    GET /api/gallery/ - List gallery images. Public visitors see visible images only.
    POST /api/gallery/ - Upload and save a gallery image (owners only).
    """
    serializer_class = GallerySerializer

    def get_queryset(self):
        queryset = Gallery.objects.order_by('-created_at')
        try:
            if not (self.request.user and self.request.user.is_authenticated):
                return queryset.filter(is_visible=True)
            is_visible = self.request.query_params.get('is_visible')
            if is_visible in ['true', 'True', '1']:
                return queryset.filter(is_visible=True)
            elif is_visible in ['false', 'False', '0']:
                return queryset.filter(is_visible=False)
        except Exception:
            pass
        return queryset

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()


        # Handle file upload
        image_file = request.FILES.get('image')
        if image_file:
            try:
                uploaded_url = upload_image_to_supabase(image_file, folder="gallery")
                data['image_link'] = uploaded_url
            except ValueError as ve:
                return Response({'error': str(ve)}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                logger.error(f"Gallery upload failed: {e}")
                return Response({'error': 'Failed to upload image.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if not data.get('image_link'):
            return Response({'error': 'Please provide an image file.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class GalleryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/gallery/<id>/ - Retrieve single gallery image. Publicly accessible.
    PATCH /api/gallery/<id>/ - Replace gallery image (owners only).
    DELETE /api/gallery/<id>/ - Delete gallery image from database and storage (owners only).
    """
    serializer_class = GallerySerializer
    queryset = Gallery.objects.all()

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_image = instance.image_link
        data = request.data.copy()

        image_file = request.FILES.get('image')
        if image_file:
            try:
                uploaded_url = upload_image_to_supabase(image_file, folder="gallery")
                data['image_link'] = uploaded_url
            except ValueError as ve:
                return Response({'error': str(ve)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if image_file and old_image and old_image != serializer.data.get('image_link'):
            delete_image_from_supabase(old_image)

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        image_url = instance.image_link
        instance.delete()

        if image_url:
            delete_image_from_supabase(image_url)

        return Response(status=status.HTTP_204_NO_CONTENT)


# ==============================================================================
# BRANCH MANAGEMENT APIS
# ==============================================================================

class BranchListCreateView(generics.ListCreateAPIView):
    """
    GET /api/branches/ - List all branches with menu and feedback counts (optimized, no N+1). Publicly accessible.
    POST /api/branches/ - Create a new branch (authenticated owners only).
    """
    serializer_class = BranchSerializer

    def get_queryset(self):
        return (
            Branch.objects.annotate(
                annotated_menu_count=Count('menu_items', distinct=True),
                annotated_feedback_count=Count('feedbacks', distinct=True),
            ).order_by('id')
        )

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]


class BranchDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/branches/<id>/ - Retrieve single branch. Publicly accessible.
    PATCH /api/branches/<id>/ - Update branch details (authenticated owners only).
    DELETE /api/branches/<id>/ - Delete branch safely (checks related menu items and feedback).
    """
    serializer_class = BranchSerializer

    def get_queryset(self):
        return (
            Branch.objects.annotate(
                annotated_menu_count=Count('menu_items', distinct=True),
                annotated_feedback_count=Count('feedbacks', distinct=True),
            )
        )

    def get_permissions(self):
        if self.request.method in ['GET', 'HEAD', 'OPTIONS']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        menu_count = instance.menu_items.count()
        feedback_count = instance.feedbacks.count()
        force = request.query_params.get('force') == 'true'

        if (menu_count > 0 or feedback_count > 0) and not force:
            return Response(
                {
                    "error": (
                        f"Cannot delete branch '{instance.address}' without confirmation. "
                        f"It currently has {menu_count} menu items and {feedback_count} customer feedbacks."
                    ),
                    "requires_confirmation": True,
                    "menu_count": menu_count,
                    "feedback_count": feedback_count,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==============================================================================
# FEEDBACK MANAGEMENT APIS
# ==============================================================================

class FeedbackListView(generics.ListCreateAPIView):
    """
    GET /api/feedback/?branch_id=<id>&is_featured=<true|false>
    List customer feedback (supports branch and featured filters).
    Unauthenticated users can view featured feedbacks. Authenticated owners see all.

    POST /api/feedback/
    Submit customer feedback for a branch. Publicly accessible.
    """
    permission_classes = (AllowAny,)
    serializer_class = FeedbackSerializer

    def perform_create(self, serializer):
        serializer.save(is_featured=False)

    def get_queryset(self):
        queryset = Feedback.objects.select_related('branch').order_by('-created_at')

        # If unauthenticated public visitor, strictly return only featured feedbacks
        if not (self.request.user and self.request.user.is_authenticated):
            queryset = queryset.filter(is_featured=True)
        else:
            is_featured = self.request.query_params.get('is_featured')
            if is_featured in ['true', 'True', '1']:
                queryset = queryset.filter(is_featured=True)
            elif is_featured in ['false', 'False', '0']:
                queryset = queryset.filter(is_featured=False)

        branch_id = self.request.query_params.get('branch_id')
        if branch_id and branch_id not in ('all', 'undefined', 'null'):
            try:
                queryset = queryset.filter(branch_id=int(branch_id))
            except (ValueError, TypeError):
                queryset = queryset.none()
        return queryset


class FeedbackDetailView(generics.RetrieveUpdateAPIView):
    """
    GET /api/feedback/<id>/ - Retrieve a single feedback.
    PATCH /api/feedback/<id>/ - Update feedback (e.g. toggle is_featured). Authenticated owners only.
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.select_related('branch')


# ==============================================================================
# CATEGORY APIS
# ==============================================================================

class CategoryListView(generics.ListAPIView):
    """
    GET /api/categories/ - List all food categories for dynamic form dropdowns and menu filters.
    """
    permission_classes = (AllowAny,)
    serializer_class = CategorySerializer
    queryset = Category.objects.all().order_by('name')
