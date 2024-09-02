from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.contrib.auth import authenticate, login

from app.utils.FormValidator import FormValidator
from django.contrib.auth.models import User
from app.utils.RegisteredUserCreator import RegisteredUserCreator


class UserController:
    ROUTE_REGISTER = 'register/'

    def action_register(self, request) -> JsonResponse:
        form_data = request.POST
        form_validator = FormValidator()

        if not form_validator.validate_registration(form_data):
            return JsonResponse({'error': 'Failed to register'}, status=400)

        if self.__check_for_existing_user(form_data[FormValidator.FORM_FIELD_EMAIL]):
            return JsonResponse({'error': 'User with this email already exists'}, status=400)

        registered_user_creator = RegisteredUserCreator()

        new_registered_user = (registered_user_creator.create()
            .set_first_name(form_data[FormValidator.FORM_FIELD_FIRST_NAME])
            .set_last_name(form_data[FormValidator.FORM_FIELD_LAST_NAME])
            .set_email(form_data[FormValidator.FORM_FIELD_EMAIL])
            .set_password(form_data[FormValidator.FORM_FIELD_PASSWORD])
            .set_birth_date(form_data[FormValidator.FORM_FIELD_BIRTH_DATE])
            .get_registered_user()
         )

        new_registered_user.save()

        login(request, new_registered_user.user)

        return JsonResponse(
            {
                'detail': 'Registered successfully',
                'username': new_registered_user.user.username,
                'is_authenticated': True,
            },
            status=200
        )

    @staticmethod
    def __check_for_existing_user(username: str) -> bool:
        try:
            User.objects.filter(username__exact=username).get()
            return True
        except ObjectDoesNotExist:
            return False

    ROUTE_LOGIN = 'login/'

    def action_login(self, request) -> JsonResponse:
        form_data = request.POST
        form_validator = FormValidator()

        if not form_validator.validate_login(form_data):
            return JsonResponse({'error': 'Failed to login'}, status=400)

        user = authenticate(username=form_data[FormValidator.FORM_FIELD_EMAIL], password=form_data[FormValidator.FORM_FIELD_PASSWORD])

        if not user:
            return JsonResponse({'error': 'User doesn\'t exist'}, status=400)

        return JsonResponse(
            {
                'detail': 'Logged in successfully',
                'username': user.username,
                'is_authenticated': True,
                'user_id': user.id,
            },
            status=200
        )
