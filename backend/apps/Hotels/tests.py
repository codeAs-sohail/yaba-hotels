from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User, Category, Branch, Menu, OnlinePlatforms, Feedback, Gallery


class YabaFastFoodAPITests(APITestCase):
    def setUp(self):
        # Create test owner user
        self.owner = User.objects.create_user(
            email="owner@yabafastfood.com",
            name="Owner Admin",
            password="StrongPassword123!",
            is_staff=True,
        )

        # Create test categories
        self.cat_chicken = Category.objects.create(name="Chicken Starters")
        self.cat_rice = Category.objects.create(name="Fried Rice")

        # Create test branches
        self.branch_tegal = Branch.objects.create(
            address="Tegal Kunta, Hyderabad",
            phone_number="9876543210",
            email="tegalkunta@yabafastfood.com",
            location="https://maps.google.com/?q=tegalkunta",
        )
        self.branch_vattepally = Branch.objects.create(
            address="Vattepally, Hyderabad",
            phone_number="9876543211",
            email="vattepally@yabafastfood.com",
            location="https://maps.google.com/?q=vattepally",
        )

        # Create test menu items
        self.menu_item_single = Menu.objects.create(
            branch=self.branch_tegal,
            category=self.cat_chicken,
            item="Chicken 65",
            item_type="single",
            price=120.00,
            description="Crispy and spicy chicken 65",
        )
        self.menu_item_full = Menu.objects.create(
            branch=self.branch_tegal,
            category=self.cat_chicken,
            item="Chicken 65",
            item_type="full",
            price=220.00,
            description="Full portion chicken 65",
        )

        # Create platform links
        OnlinePlatforms.objects.create(
            branch=self.branch_tegal,
            item=self.menu_item_single,
            zomato="https://zomato.com/order/single-1",
            swiggy="https://swiggy.com/order/single-1",
        )

        # Create test feedback
        self.feedback_featured = Feedback.objects.create(
            branch=self.branch_tegal,
            stars=5,
            email="happy_customer@example.com",
            message="Best Chicken 65 in town!",
            is_featured=True,
        )
        self.feedback_unfeatured = Feedback.objects.create(
            branch=self.branch_tegal,
            stars=4,
            email="customer2@example.com",
            message="Good taste, fast service.",
            is_featured=False,
        )

    # =========================================================================
    # 1. AUTHENTICATION TESTS
    # =========================================================================

    def test_owner_login_success(self):
        url = reverse("login")
        response = self.client.post(url, {
            "email": "owner@yabafastfood.com",
            "password": "StrongPassword123!",
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_owner_login_failure(self):
        url = reverse("login")
        response = self.client.post(url, {
            "email": "owner@yabafastfood.com",
            "password": "WrongPassword",
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh(self):
        # Login first
        login_url = reverse("login")
        login_resp = self.client.post(login_url, {
            "email": "owner@yabafastfood.com",
            "password": "StrongPassword123!",
        })
        refresh_token = login_resp.data["refresh"]

        # Refresh
        refresh_url = reverse("refresh")
        refresh_resp = self.client.post(refresh_url, {"refresh": refresh_token})
        self.assertEqual(refresh_resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh_resp.data)

    def test_logout_blacklists_token(self):
        login_url = reverse("login")
        login_resp = self.client.post(login_url, {
            "email": "owner@yabafastfood.com",
            "password": "StrongPassword123!",
        })
        access = login_resp.data["access"]
        refresh = login_resp.data["refresh"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        logout_url = reverse("logout")
        logout_resp = self.client.post(logout_url, {"refresh": refresh})
        self.assertEqual(logout_resp.status_code, status.HTTP_200_OK)

    # =========================================================================
    # 2. BRANCH API TESTS
    # =========================================================================

    def test_public_can_list_branches(self):
        url = reverse("branch-list-create")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        # Check annotated counts are returned
        self.assertEqual(response.data[0]["menu_count"], 2)
        self.assertEqual(response.data[0]["feedback_count"], 2)

    def test_unauthorized_user_cannot_create_branch(self):
        url = reverse("branch-list-create")
        response = self.client.post(url, {
            "address": "Shahalibanda, Hyderabad",
            "phone_number": "9876543212",
            "email": "shahalibanda@yabafastfood.com",
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_owner_can_create_branch(self):
        self.client.force_authenticate(user=self.owner)
        url = reverse("branch-list-create")
        response = self.client.post(url, {
            "address": "Shahalibanda, Hyderabad",
            "phone_number": "9876543212",
            "email": "shahalibanda@yabafastfood.com",
            "location": "https://maps.google.com/?q=shahalibanda",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Branch.objects.count(), 3)

    # =========================================================================
    # 3. MENU API TESTS
    # =========================================================================

    def test_public_can_list_menu(self):
        url = reverse("menu-list-create")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_menu_branch_filtering(self):
        url = f"{reverse('menu-list-create')}?branch_id={self.branch_tegal.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        # Non-existent branch returns empty list
        empty_url = f"{reverse('menu-list-create')}?branch_id=9999"
        empty_resp = self.client.get(empty_url)
        self.assertEqual(len(empty_resp.data), 0)

    def test_public_can_retrieve_single_menu_item(self):
        url = reverse("menu-detail", kwargs={"pk": self.menu_item_single.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["item"], "Chicken 65")
        self.assertEqual(response.data["item_type"], "single")
        self.assertEqual(response.data["online_platforms"]["zomato"], "https://zomato.com/order/single-1")

    def test_unauthorized_user_cannot_create_or_delete_menu(self):
        list_url = reverse("menu-list-create")
        post_resp = self.client.post(list_url, {
            "item": "Hakka Noodles",
            "item_type": "full",
            "price": "140.00",
            "branch": self.branch_tegal.id,
            "category": self.cat_rice.id,
        })
        self.assertEqual(post_resp.status_code, status.HTTP_401_UNAUTHORIZED)

        detail_url = reverse("menu-detail", kwargs={"pk": self.menu_item_single.id})
        del_resp = self.client.delete(detail_url)
        self.assertEqual(del_resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_menu_price_validation(self):
        self.client.force_authenticate(user=self.owner)
        url = reverse("menu-list-create")

        # Zero or negative price must be rejected
        resp_zero = self.client.post(url, {
            "item": "Hakka Noodles",
            "item_type": "full",
            "price": "0",
            "branch": self.branch_tegal.id,
            "category": self.cat_rice.id,
        })
        self.assertEqual(resp_zero.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("price", resp_zero.data)

        # Blank item name must be rejected
        resp_blank = self.client.post(url, {
            "item": "   ",
            "item_type": "full",
            "price": "120.00",
            "branch": self.branch_tegal.id,
            "category": self.cat_rice.id,
        })
        self.assertEqual(resp_blank.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("item", resp_blank.data)

    def test_authenticated_owner_can_create_menu_with_platforms(self):
        self.client.force_authenticate(user=self.owner)
        url = reverse("menu-list-create")
        response = self.client.post(url, {
            "item": "Veg Manchurian",
            "item_type": "full",
            "price": "130.00",
            "description": "Crispy veg balls in tangy Manchurian sauce",
            "branch": self.branch_tegal.id,
            "category": self.cat_chicken.id,
            "zomato": "https://zomato.com/manchurian",
            "swiggy": "https://swiggy.com/manchurian",
            "ownly": "https://ownly.com/manchurian",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["item"], "Veg Manchurian")
        self.assertEqual(response.data["online_platforms"]["ownly"], "https://ownly.com/manchurian")

    # =========================================================================
    # 4. CATEGORY & FEEDBACK TESTS
    # =========================================================================

    def test_public_can_list_categories(self):
        url = reverse("category-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_public_feedback_returns_only_featured(self):
        url = reverse("feedback-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertTrue(response.data[0]["is_featured"])

    def test_authenticated_owner_can_see_all_feedbacks(self):
        self.client.force_authenticate(user=self.owner)
        url = reverse("feedback-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    # =========================================================================
    # 5. HEALTH CHECK & DB KEEP-ALIVE TESTS
    # =========================================================================

    def test_health_check_endpoint_pings_db(self):
        response = self.client.get("/health/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["server"], "online")
        self.assertEqual(data["database"], "active")
        self.assertIn("db_latency_ms", data)

    def test_root_endpoint_pings_db(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["server"], "online")
        self.assertEqual(data["database"], "active")
        self.assertIn("db_latency_ms", data)


