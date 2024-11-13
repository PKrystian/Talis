from django.test import TestCase, Client
from django.urls import reverse
from app.models import BoardGame


class BoardGameTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.board_game = BoardGame.objects.create(name="Test Game", description="A test board game")

    def test_board_game_detail(self):
        response = self.client.get(reverse('board-game-detail', args=[self.board_game.id]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.board_game.name)
