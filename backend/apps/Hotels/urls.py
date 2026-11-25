from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView,
    LogoutView,
    MenuListCreateView,
    MenuDetailView,
    GalleryListCreateView,
    GalleryDetailView,
    BranchListCreateView,
    BranchDetailView,
    FeedbackListView,
    FeedbackDetailView,
    CategoryListView,
)

urlpatterns = [
    # Authentication Endpoints
    path("Login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("Refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("Logout/", LogoutView.as_view(), name="logout"),

    # Menu Management Endpoints
    path("menu/", MenuListCreateView.as_view(), name="menu-list-create"),
    path("menu/<int:pk>/", MenuDetailView.as_view(), name="menu-detail"),

    # Gallery Management Endpoints
    path("gallery/", GalleryListCreateView.as_view(), name="gallery-list-create"),
    path("gallery/<int:pk>/", GalleryDetailView.as_view(), name="gallery-detail"),

    # Branch Management Endpoints
    path("branches/", BranchListCreateView.as_view(), name="branch-list-create"),
    path("branches/<int:pk>/", BranchDetailView.as_view(), name="branch-detail"),

    # Feedback Management Endpoints
    path("feedback/", FeedbackListView.as_view(), name="feedback-list"),
    path("feedback/<int:pk>/", FeedbackDetailView.as_view(), name="feedback-detail"),

    # Category Helper Endpoints
    path("categories/", CategoryListView.as_view(), name="category-list"),
]
