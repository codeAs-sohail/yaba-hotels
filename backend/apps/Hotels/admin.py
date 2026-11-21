from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Category, Branch, Menu, OnlinePlatforms, Gallery, Feedback


@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('id', 'email', 'name', 'is_staff', 'is_active', 'created_at')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('email', 'name')
    ordering = ('id',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    readonly_fields = ('created_at', 'updated_at')
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password', 'is_staff', 'is_active'),
        }),
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at', 'updated_at')
    search_fields = ('name',)
    ordering = ('id',)


class OnlinePlatformsInline(admin.StackedInline):
    model = OnlinePlatforms
    extra = 0
    can_delete = True


@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('id', 'address', 'phone_number', 'email', 'created_at')
    search_fields = ('address', 'phone_number', 'email')
    ordering = ('id',)


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ('id', 'item', 'item_type', 'price', 'branch', 'category', 'created_at')
    list_filter = ('branch', 'category', 'item_type')
    search_fields = ('item', 'description')
    ordering = ('-created_at',)
    inlines = [OnlinePlatformsInline]


@admin.register(OnlinePlatforms)
class OnlinePlatformsAdmin(admin.ModelAdmin):
    list_display = ('id', 'item', 'branch', 'zomato', 'swiggy', 'ownly', 'created_at')
    list_filter = ('branch',)
    search_fields = ('item__item', 'branch__address')
    ordering = ('-created_at',)


@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('id', 'image_link', 'created_at')
    ordering = ('-created_at',)


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'branch', 'stars', 'email', 'is_featured', 'created_at')
    list_filter = ('branch', 'stars', 'is_featured')
    search_fields = ('email', 'message')
    ordering = ('-created_at',)
