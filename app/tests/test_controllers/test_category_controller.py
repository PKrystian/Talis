import json

import pytest

from app.controllers.CategoryController import CategoryController
from app.models import Category


class TestCategoryController:
    category_controller: CategoryController

    def setup_class(self):
        self.category_controller = CategoryController()

    @pytest.mark.django_db
    def test_action_get_all_game_categories(self):
        Category.objects.create(name='Card Game')
        Category.objects.create(name='Exploration')
        Category.objects.create(name='Adventure')

        result = self.category_controller.action_get_all_game_categories()
        data = json.loads(result.getvalue())

        assert(result.status_code == 200)
        assert(len(data) == 3)
