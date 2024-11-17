from django.contrib.auth.models import User
from django.http import JsonResponse
from app.models import UserBoardGameCollection, BoardGame, BoardGameCategory


class CollectionController:
    ROUTE: str = 'user-collection/'

    def action_user_collection(self, user_id: int) -> JsonResponse:
        wishlist_games_ids = UserBoardGameCollection.objects.filter(
            user_id=user_id, status='wishlist'
        ).values_list('board_game_id', flat=True)

        library_games_ids = UserBoardGameCollection.objects.filter(
            user_id=user_id, status='library'
        ).values_list('board_game_id', flat=True)

        wishlist_games = BoardGame.objects.filter(id__in=wishlist_games_ids)
        library_games = BoardGame.objects.filter(id__in=library_games_ids)

        wishlist_data = self.serialize_board_games(wishlist_games, user_id)
        library_data = self.serialize_board_games(library_games, user_id)

        return JsonResponse({
            'wishlist': wishlist_data,
            'library': library_data
        }, safe=False)

    @staticmethod
    def serialize_board_games(board_games: list, user_id: int):
        data = []
        for board_game in board_games:
            data.append({
                'id': board_game.id,
                'name': board_game.name,
                'image_url': board_game.image_url,
                'rating': board_game.rating,
                'collection_created_at': UserBoardGameCollection.objects.filter(board_game=board_game, user_id=user_id).first().created_at,
                'is_expansion': board_game.boardgamecategory_set.filter(category_id=BoardGameCategory.CATEGORY_EXPANSION).exists()
            })
        return data

    ROUTE_ADD = 'add_to_collection/'

    @staticmethod
    def action_add_to_collection(user_id: int, board_game_id: int, status: str) -> JsonResponse:
        if not user_id or not board_game_id or not status:
            return JsonResponse({'error': 'User ID, board game ID, and status are required.'}, status=400)

        user = User.objects.filter(id=user_id).first()
        if not user:
            return JsonResponse({'error': 'User does not exist.'}, status=404)

        board_game = BoardGame.objects.filter(id=board_game_id).first()
        if not board_game:
            return JsonResponse({'error': 'Board game does not exist.'}, status=404)

        if UserBoardGameCollection.objects.filter(user=user, board_game=board_game, status=status).exists():
            return JsonResponse({'error': 'This board game is already in the user\'s collection with the same status.'}, status=400)

        UserBoardGameCollection.objects.create(user=user, board_game=board_game, status=status)

        return JsonResponse({'detail': 'Board game added to your collection successfully.'}, status=200)

    ROUTE_REMOVE = 'remove_from_collection/'

    @staticmethod
    def action_remove_from_collection(user_id: int, board_game_id: int, status: str) -> JsonResponse:
        if not user_id or not board_game_id or not status:
            return JsonResponse({'error': 'User ID, board game ID, and status are required.'}, status=400)

        user = User.objects.filter(id=user_id).first()
        if not user:
            return JsonResponse({'error': 'User does not exist.'}, status=404)

        board_game = BoardGame.objects.filter(id=board_game_id).first()
        if not board_game:
            return JsonResponse({'error': 'Board game does not exist.'}, status=404)

        collection_entry = UserBoardGameCollection.objects.filter(user=user, board_game=board_game, status=status).first()
        if not collection_entry:
            return JsonResponse(
                {'error': 'This board game is not in the user\'s collection with the specified status.'}, status=404)

        collection_entry.delete()
        return JsonResponse({'detail': 'Board game removed from your collection successfully.'}, status=200)
