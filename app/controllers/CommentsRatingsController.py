from app.models.board_game import BoardGame
from app.models.comments_ratings import CommentsRatings
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from app.utils.creators.LogErrorCreator import LogErrorCreator
from better_profanity import profanity


class CommentsRatingsController:
    ROUTE_ADD = 'add-comment/'

    @staticmethod
    def action_add_comment(user_id: int, board_game_id: int, comment_str: str|None, rating_fl: float|None) -> JsonResponse:
        try:
            user = User.objects.get(id=user_id)
            board_game = BoardGame.objects.get(id=board_game_id)

            new_rating = rating_fl
            existing_comments = CommentsRatings.objects.filter(user=user, board_game=board_game)

            if new_rating is not None:
                if existing_comments.exists():
                    existing_comments.update(rating=None)

            comment = CommentsRatings(
                user=user,
                board_game=board_game,
                comment=comment_str,
                rating=new_rating
            )
            comment.save()

            return JsonResponse({'comment_id': comment.id}, status=201)
        except ValidationError as e:
            return JsonResponse({'error': e.message}, status=400)
        except User.DoesNotExist:
            LogErrorCreator().create().critical().log(
                message=f"User with id {user_id} does not exist",
                trigger='action_add_comment',
                class_reference='CommentsRatingsController'
            )
            return JsonResponse({'error': 'User not found'}, status=404)
        except BoardGame.DoesNotExist:
            LogErrorCreator().create().critical().log(
                message=f"Board game with id {board_game_id} does not exist",
                trigger='action_add_comment',
                class_reference='CommentsRatingsController'
            )
            return JsonResponse({'error': 'Board game not found'}, status=404)
        except Exception as e:
            LogErrorCreator().create().critical().log(
                message=str(e),
                trigger='action_add_comment',
                class_reference='CommentsRatingsController'
            )
            return JsonResponse({'error': 'Internal server error'}, status=500)

    ROUTE_GET = 'get-comments/'

    @staticmethod
    def action_get_comments(board_game_id: int) -> JsonResponse:
        try:
            comments = CommentsRatings.objects.filter(board_game_id=board_game_id)
            comments_list = []
            for comment in comments:
                comments_list.append({
                    'comment_id': comment.id,
                    'user_id': comment.user.id,
                    'user_name': comment.user.first_name + ' ' + comment.user.last_name,
                    'profile_image_url': comment.user.registereduser.profile_image_url,
                    'comment': profanity.censor(comment.comment),
                    'rating': comment.rating,
                    'created_at': comment.created_at,
                    'updated_at': comment.updated_at
                })
            return JsonResponse({'comments': comments_list}, status=200)
        except Exception as e:
            LogErrorCreator().create().critical().log(
                message=str(e),
                trigger='action_get_comments',
                class_reference='CommentsRatingsController'
            )
            return JsonResponse({'error': 'Internal server error'}, status=500)

    ROUTE_UPDATE = 'update-comment/'

    @staticmethod
    def action_update_comment(comment_id: int, comment_str: str|None, rating_fl: float|None) -> JsonResponse:
        try:
            comment = CommentsRatings.objects.get(id=comment_id)
            comment.comment = comment_str

            if rating_fl is not None:
                try:
                    new_rating = float(rating_fl)
                    if comment.rating != new_rating:
                        existing_comments = CommentsRatings.objects.filter(user=comment.user,board_game=comment.board_game)
                        if existing_comments.exists():
                            existing_comments.update(rating=None)
                        comment.rating = new_rating
                except ValueError:
                    comment.rating = None
            else:
                comment.rating = None

            comment.save()
            return JsonResponse({'comment_id': comment.id}, status=200)
        except CommentsRatings.DoesNotExist:
            LogErrorCreator().create().critical().log(
                message=f"Comment with id {comment_id} does not exist",
                trigger='action_update_comment',
                class_reference='CommentsRatingsController'
            )
            return JsonResponse({'error': 'Comment not found'}, status=404)
        except Exception as e:
            LogErrorCreator().create().critical().log(
                message=str(e),
                trigger='action_update_comment',
                class_reference='CommentsRatingsController'
            )
            return JsonResponse({'error': 'Internal server error'}, status=500)

    ROUTE_DELETE = 'delete-comment/'

    @staticmethod
    def action_delete_comment(comment_id: int) -> JsonResponse:
        try:
            comment = CommentsRatings.objects.get(id=comment_id)
            comment.delete()
            return JsonResponse({'comment_id': comment_id}, status=200)
        except CommentsRatings.DoesNotExist:
            LogErrorCreator().create().critical().log(
                message=f"Comment with id {comment_id} does not exist",
                trigger='action_delete_comment',
                class_reference='CommentsRatingsController'
            )
            return JsonResponse({'error': 'Comment not found'}, status=404)
        except Exception as e:
            LogErrorCreator().create().critical().log(
                message=str(e),
                trigger='action_delete_comment',
                class_reference='CommentsRatingsController'
            )
            return JsonResponse({'error': 'Internal server error'}, status=500)

    ROUTE_GET_USER_RATINGS = 'get-user-ratings/'

    @staticmethod
    def action_get_user_ratings_calculated(board_game_id: int) -> JsonResponse:
        try:
            comments = CommentsRatings.objects.filter(board_game_id=board_game_id).exclude(rating__isnull=True)

            if not comments.exists():
                return JsonResponse({'average_rating': 0}, status=200)

            total_rating = sum(comment.rating for comment in comments)
            ratings_count = comments.count()

            average_rating = total_rating / ratings_count if ratings_count > 0 else 0

            return JsonResponse({'average_rating': average_rating}, status=200)
        except Exception as e:
            LogErrorCreator().create().critical().log(
                message=str(e),
                trigger='action_get_user_ratings_calculated',
                class_reference='CommentsRatingsController'
            )
            return JsonResponse({'error': 'Internal server error'}, status=500)