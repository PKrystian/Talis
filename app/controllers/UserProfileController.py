from app.models.registered_user import RegisteredUser
from django.http import JsonResponse
from django.contrib.auth.models import User


class UserProfileController:
    ROUTE_DETAIL: str = 'user/<int:user_id>/'

    @staticmethod
    def action_user_profile_detail(user_id: int) -> JsonResponse:
        try:
            registered_user = RegisteredUser.objects.get(user_id=user_id)
            user = User.objects.get(id=user_id)
            user_profile = {
                'first_name': user.first_name,
                'last_name': user.last_name,
                'profile_image_url': registered_user.profile_image_url,
                'date_joined': user.date_joined,

                'email': user.email,
                'birth_date': registered_user.birth_date,

                'user_id': user.id,
                'username': user.username,
                'is_superuser': user.is_superuser,
                'last_login': user.last_login,
                'is_active': user.is_active,
            }
        except RegisteredUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        return JsonResponse(user_profile)
