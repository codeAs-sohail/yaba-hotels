from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser,PermissionsMixin


class TimeStampedModel(models.Model):
    """
    Abstract base model that provides self-updating
    created_at and updated_at timestamp fields.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True



class UserManager(BaseUserManager):
 
    def create_user(self, email, password=None, **extrafields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extrafields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extrafields):
        extrafields.setdefault("is_staff", True)
        extrafields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extrafields)
    

class User(AbstractBaseUser,PermissionsMixin,TimeStampedModel):
    
    email=models.EmailField(unique=True)
    name=models.CharField(max_length=100)
    is_active=models.BooleanField(default=True)
    is_staff=models.BooleanField(default=False)
    """
    role-->
    Newcomer---Join existing channels---onlyDefault when user signs up
    Member----Create their own channels----Reach minimum score + some safety conditions
    """
    
    USERNAME_FIELD="email"
    REQUIRED_FIELDS=["name"]
    
    
    """
        This mainly matters when you run:
        python manage.py createsuperuser
        REQUIRED_FIELDS tells Django:
        "Besides my USERNAME_FIELD, what other fields should I ask for when creating a superuser?"    
    """
    
    objects=UserManager()
    
    
    def __str__(self):
        return self.email
    











class Category(TimeStampedModel):
    """
    Food category (e.g., Starters, Main Course, Biryani, Desserts).
    """
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Branch(TimeStampedModel):
    """
    Hotel / restaurant branch location and contact details.
    """
    address = models.CharField(max_length=255)
    location = models.URLField(max_length=500, blank=True, default='')
    phone_number = models.CharField(max_length=30)
    email = models.EmailField(max_length=254)

    def __str__(self):
        return self.address


class Menu(TimeStampedModel):
    ITEM_CHOICES = (
        
        ("single", "Single"),
        ("full", "Full"),
    
    )    


    """
    Menu item belonging to a specific branch and category.
    """
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        related_name='menu_items'
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='menu_items'
    )
    item = models.CharField(max_length=150)
    item_type=models.CharField( max_length=20,choices=ITEM_CHOICES,default="single")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, default='')
    image = models.CharField(max_length=500, blank=True, default='')
    
    def __str__(self):
        return f"{self.item} ({self.branch.address}) - ₹{self.price}"


class OnlinePlatforms(TimeStampedModel):
    """
    Links to delivery and aggregator platforms for a menu item at a branch.
    """
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        related_name='online_platforms'
    )
    item = models.ForeignKey(
        Menu,
        on_delete=models.CASCADE,
        related_name='online_platforms'
    )
    zomato = models.URLField(max_length=500, blank=True, default='')
    swiggy = models.URLField(max_length=500, blank=True, default='')
    ownly = models.URLField(max_length=500, blank=True, default='')

    def __str__(self):
        return f"{self.item.item} delivery links ({self.branch.address})"


class Gallery(TimeStampedModel):
    """
    Image showcase storing Supabase image URL or path.
    """
    image_link = models.CharField(max_length=500)

    def __str__(self):
        return f"Gallery Image #{self.id}"


class Feedback(TimeStampedModel):

    """
    Customer feedback and ratings for a branch.
    """
    branch = models.ForeignKey(
        Branch,
        on_delete=models.CASCADE,
        related_name='feedbacks'
    )
    stars = models.PositiveSmallIntegerField()
    email = models.EmailField(max_length=254)
    qualities = models.JSONField(default=list, blank=True)
    message = models.TextField(blank=True, default='')
    is_featured = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.stars}★ from {self.email} ({self.branch.address})"
