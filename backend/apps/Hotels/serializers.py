from rest_framework import serializers
from .models import Category, Branch, Menu, OnlinePlatforms, Gallery, Feedback


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'created_at', 'updated_at']

    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Category name cannot be blank.")
        return value.strip()


class BranchSerializer(serializers.ModelSerializer):
    menu_count = serializers.SerializerMethodField()
    feedback_count = serializers.SerializerMethodField()

    class Meta:
        model = Branch
        fields = [
            'id',
            'address',
            'location',
            'phone_number',
            'email',
            'menu_count',
            'feedback_count',
            'created_at',
            'updated_at',
        ]

    def get_menu_count(self, obj):
        if hasattr(obj, 'annotated_menu_count'):
            return obj.annotated_menu_count
        return obj.menu_items.count()

    def get_feedback_count(self, obj):
        if hasattr(obj, 'annotated_feedback_count'):
            return obj.annotated_feedback_count
        return obj.feedbacks.count()

    def validate_address(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Branch address cannot be blank.")
        return value.strip()


class OnlinePlatformsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnlinePlatforms
        fields = ['id', 'branch', 'item', 'zomato', 'swiggy', 'ownly', 'created_at', 'updated_at']


class MenuSerializer(serializers.ModelSerializer):
    branch_address = serializers.CharField(source='branch.address', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    online_platforms = serializers.SerializerMethodField()

    class Meta:
        model = Menu
        fields = [
            'id',
            'item',
            'item_type',
            'price',
            'description',
            'image',
            'branch',
            'branch_address',
            'category',
            'category_name',
            'online_platforms',
            'created_at',
            'updated_at',
        ]

    def validate_item(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Item name cannot be blank.")
        return value.strip()

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than zero.")
        return value

    def get_online_platforms(self, obj):
        # Retrieve associated OnlinePlatforms record
        platform = obj.online_platforms.first()
        if platform:
            return {
                'id': platform.id,
                'zomato': platform.zomato or '',
                'swiggy': platform.swiggy or '',
                'ownly': platform.ownly or '',
            }
        return {
            'id': None,
            'zomato': '',
            'swiggy': '',
            'ownly': '',
        }


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = ['id', 'image_link', 'created_at', 'updated_at']


class FeedbackSerializer(serializers.ModelSerializer):
    branch_address = serializers.CharField(source='branch.address', read_only=True)

    class Meta:
        model = Feedback
        fields = [
            'id',
            'branch',
            'branch_address',
            'name',
            'phone_number',
            'stars',
            'email',
            'qualities',
            'message',
            'is_featured',
            'created_at',
            'updated_at',
        ]
        extra_kwargs = {
            'is_featured': {'read_only': True},
            'name': {'required': False, 'allow_blank': True},
            'phone_number': {'required': False, 'allow_blank': True},
        }
