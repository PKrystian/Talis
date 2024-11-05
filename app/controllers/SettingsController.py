from app.models.registered_user import RegisteredUser
from django.http import JsonResponse
from django.contrib.auth.models import User


class SettingsController:
    ROUTE_DETAIL: str = 'update_user/'

    @staticmethod
    def action_update_user(request) -> JsonResponse:
        try:
            user_id = request.POST.get('user_id')
            updated_user_data = request.POST.dict()

            registered_user = RegisteredUser.objects.get(user_id=user_id)
            user = registered_user.user

            user.email = updated_user_data.get('updated_user[email]', user.email)
            user.username = updated_user_data.get('updated_user[email]', user.email)
            user.first_name = updated_user_data.get('updated_user[first_name]', user.first_name)
            user.last_name = updated_user_data.get('updated_user[last_name]', user.last_name)
            registered_user.profile_image_url = updated_user_data.get('updated_user[profile_image_url]', registered_user.profile_image_url)
            registered_user.birth_date = updated_user_data.get('updated_user[birth_date]', registered_user.birth_date)

            user.save()
            registered_user.save()

        except RegisteredUser.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        return JsonResponse({'message': 'User profile updated successfully'})