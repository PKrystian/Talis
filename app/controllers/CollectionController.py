from django.contrib.auth.models import User
from django.http import JsonResponse
from app.models import UserBoardGameCollection, BoardGame


class CollectionController:
    ROUTE: str = 'user-collection/'

    def action_user_collection(self, request) -> JsonResponse:
        user_id = request.POST.get('user_id')

        wishlist_games_ids = UserBoardGameCollection.objects.filter(
            user_id=user_id, status='wishlist'
        ).values_list('board_game_id', flat=True)

        library_games_ids = UserBoardGameCollection.objects.filter(
            user_id=user_id, status='library'
        ).values_list('board_game_id', flat=True)

        wishlist_games = BoardGame.objects.filter(id__in=wishlist_games_ids)
        library_games = BoardGame.objects.filter(id__in=library_games_ids)

        wishlist_data = self.serialize_board_games(wishlist_games)
        library_data = self.serialize_board_games(library_games)

        return JsonResponse({
            'wishlist': wishlist_data,
            'library': library_data
        }, safe=False)

    def serialize_board_games(self, board_games):
        data = []
        for board_game in board_games:
            data.append({
                'id': board_game.id,
                'name': board_game.name,
                'year_published': board_game.year_published,
                'publisher': ', '.join([bp.publisher.name for bp in board_game.boardgamepublisher_set.all()]),
                'category': ', '.join([bc.category.name for bc in board_game.boardgamecategory_set.all()]),
                'description': board_game.description,
                'min_players': board_game.min_players,
                'max_players': board_game.max_players,
                'age': board_game.age,
                'min_playtime': board_game.min_playtime,
                'max_playtime': board_game.max_playtime,
                'image_url': board_game.image_url,
            })
        return data

    ROUTE_ADD = 'add_to_collection/'

    def action_add_to_collection(self, request) -> JsonResponse:
        user_id = request.POST.get('user_id')
        board_game_id = request.POST.get('board_game_id')
        status = request.POST.get('status')

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

    def action_remove_from_collection(self, request) -> JsonResponse:
        user_id = request.POST.get('user_id')
        board_game_id = request.POST.get('board_game_id')
        status = request.POST.get('status')

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
