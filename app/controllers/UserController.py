import json
from sqlite3 import IntegrityError

from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout

from app.models.registered_user import RegisteredUser
from app.utils.FormValidator import FormValidator
from django.contrib.auth.models import User
from app.utils.creators.RegisteredUserCreator import RegisteredUserCreator


class UserController:
    ROUTE_REGISTER = 'register/'

    def action_register(self, request) -> JsonResponse:
        form_data = request.POST
        form_validator = FormValidator()

        if not form_validator.validate_registration(form_data):
            return JsonResponse(data={'error': 'Failed to register'}, status=400)

        if self.__check_for_existing_user(form_data[FormValidator.FORM_FIELD_EMAIL]):
            return JsonResponse(data={'error': 'User with this email already exists'}, status=400)

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
            data={
                'detail': 'Registered successfully',
                'username': new_registered_user.user.username,
                'is_authenticated': True,
                'user_id': new_registered_user.user.id,
                'is_superuser': new_registered_user.user.is_superuser,
                'profile_image_url': new_registered_user.profile_image_url,
                'cookie_consent': new_registered_user.cookie_consent,
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

    @staticmethod
    def action_login(request) -> JsonResponse:
        form_data = request.POST
        form_validator = FormValidator()

        if not form_validator.validate_login(form_data):
            return JsonResponse(data={'error': 'Failed to login'}, status=400)

        user = authenticate(username=form_data[FormValidator.FORM_FIELD_EMAIL],
                            password=form_data[FormValidator.FORM_FIELD_PASSWORD])

        if not user:
            return JsonResponse(data={'error': 'User does not exist'}, status=400)

        login(request, user)

        try:
            registered_user = RegisteredUser.objects.get(user=user)
            profile_image_url = registered_user.profile_image_url
            cookie_consent = registered_user.cookie_consent
        except RegisteredUser.DoesNotExist:
            profile_image_url = None
            cookie_consent = None

        return JsonResponse(
            data={
                'detail': 'Logged in successfully',
                'username': user.username,
                'is_authenticated': True,
                'user_id': user.id,
                'is_superuser': user.is_superuser,
                'profile_image_url': profile_image_url,
                'cookie_consent': cookie_consent,
            },
            status=200
        )

    ROUTE_LOGOUT = 'logout/'

    @staticmethod
    def action_logout(request) -> JsonResponse:
        logout(request)

        return JsonResponse(
            data={
                'detail': 'Logged out'
            },
            status=200
        )

    ROUTE_CHECK_AUTH = 'check-auth/'

    @staticmethod
    def check_auth(request) -> JsonResponse:
        if request.user.is_authenticated:
            try:
                registered_user = RegisteredUser.objects.get(user=request.user)
                profile_image_url = registered_user.profile_image_url
                cookie_consent = registered_user.cookie_consent
            except RegisteredUser.DoesNotExist:
                profile_image_url = None
                cookie_consent = None

            return JsonResponse(
                data={
                    'is_authenticated': True,
                    'username': request.user.username,
                    'user_id': request.user.id,
                    'profile_image_url': profile_image_url,
                    'cookie_consent': cookie_consent,
                },
                status=200
            )
        else:
            return JsonResponse({'is_authenticated': False}, status=200)

    ROUTE_CHECK_COOKIE_CONSENT = 'check-cookie-consent/'

    @staticmethod
    def check_cookie_consent(request) -> JsonResponse:
        user_id = request.POST.get('user_id')
        if user_id:
            try:
                registered_user = RegisteredUser.objects.get(user_id=user_id)
                cookie_consent = registered_user.cookie_consent
            except RegisteredUser.DoesNotExist:
                cookie_consent = None

            return JsonResponse(
                data={
                    'cookie_consent': cookie_consent,
                },
                status=200
            )
        else:
            return JsonResponse({'cookie_consent': None}, status=200)

    ROUTE_CHANGE_COOKIE_CONSENT = 'change-cookie-consent/'

    @staticmethod
    def change_cookie_consent(request) -> JsonResponse:
        user_decision = request.POST.get('cookie_consent')
        user_id = request.POST.get('user_id')
        if user_id:
            try:
                if user_decision is None:
                    return JsonResponse({'error': 'Missing cookie_consent parameter'}, status=400)

                if user_decision.lower() == 'true':
                    user_decision = True
                elif user_decision.lower() == 'false':
                    user_decision = False
                else:
                    return JsonResponse({'error': 'Invalid cookie_consent value'}, status=400)

                registered_user = RegisteredUser.objects.get(user_id=user_id)
                if not registered_user.user.username:
                    return JsonResponse({'error': 'User has no username'}, status=400)

                registered_user.cookie_consent = user_decision
                registered_user.save()

            except RegisteredUser.DoesNotExist:
                return JsonResponse({'error': 'User does not exist'}, status=400)
            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON'}, status=400)
            except IntegrityError as e:
                return JsonResponse({'error': str(e)}, status=400)

            return JsonResponse(data={'cookie_consent': user_decision}, status=200)
        else:
            return JsonResponse({'cookie_consent': None}, status=200)