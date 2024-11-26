import json
from sqlite3 import IntegrityError

from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone

from app.models.one_time_token import OneTimeToken
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
            return JsonResponse(data={'error': 'Failed to register'}, status=401)

        if self.__check_for_existing_user(form_data[FormValidator.FORM_FIELD_EMAIL]):
            return JsonResponse(data={'error': 'User with this email already exists'}, status=401)

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

        new_token = OneTimeToken.objects.create(
            email=new_registered_user.user.email,
            expiry_date=timezone.now() + timezone.timedelta(days=365)
        )

        # Password set to None uses the Email from environmental variables
        send_mail(
            subject='Talis Verify Account',
            message=f'To verify your account just follow the link below:\n'
                    f'{OneTimeToken.VERIFY_ACCOUNT_URL}{new_token.token}',
            from_email=None,
            recipient_list=[new_registered_user.user.email]
        )

        return JsonResponse(
            data={
                'detail': 'Registered successfully',
                'username': new_registered_user.user.username,
                'is_authenticated': True,
                'user_id': new_registered_user.user.id,
                'is_superuser': new_registered_user.user.is_superuser,
                'profile_image_url': new_registered_user.profile_image_url,
                'cookie_consent': new_registered_user.cookie_consent,
                'is_active': new_registered_user.user.is_active,
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
            return JsonResponse(
                data={
                    'error': 'Failed to login',
                    'reason': 'login_error',
                },
                status=401
            )

        user = authenticate(
            username=form_data[FormValidator.FORM_FIELD_EMAIL],
            password=form_data[FormValidator.FORM_FIELD_PASSWORD],
        )

        return self.__login_user_and_send_response(request, user)

    @staticmethod
    def __login_user_and_send_response(request, user):
        login(request, user)

        return JsonResponse(
            data={
                'detail': 'Logged in successfully',
                'username': user.username,
                'is_authenticated': True,
                'user_id': user.id,
                'is_superuser': user.is_superuser,
                'profile_image_url': user.registereduser.profile_image_url,
                'cookie_consent': user.registereduser.cookie_consent,
                'is_active': user.is_active,
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
                    'is_superuser': request.user.is_superuser,
                    'profile_image_url': profile_image_url,
                    'cookie_consent': cookie_consent,
                    'is_active': request.user.is_active,
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

    ROUTE_CHECK_EMAIL = 'check-email/'

    @staticmethod
    def action_check_email(email) -> JsonResponse:
        form_validator = FormValidator()

        if not form_validator.validate_email(email):
            return JsonResponse(
                data={
                    'detail': 'Email has wrong format',
                    'reason': 'email_error',
                    'validate': False,
                },
                status=401,
            )

        if not User.objects.filter(email=email).exists():
            return JsonResponse(
                data={
                    'detail': 'Email does not exist',
                    'reason': 'existing_email_error',
                    'validate': False,
                },
                status=401,
            )

        if OneTimeToken.objects.filter(
            email=email,
            expiry_date__gt=timezone.now(),
        ).exists():
            return JsonResponse(
                data={
                    'detail': 'One Time Token is pending',
                    'validate': False,
                },
                status=401,
            )

        new_token = OneTimeToken.objects.create(
            email=email
        )

        # Password set to None uses the Email from environmental variables
        send_mail(
            subject='Talis Password Reset',
            message=f'To reset your password just follow the link below:\n'
                    f'{OneTimeToken.FORGOT_PASSWORD_URL}{new_token.token}',
            from_email=None,
            recipient_list=[email]
        )

        return JsonResponse(
            data={
                'detail': 'Password reset request sent',
                'validate': True,
            },
            status=200,
        )

    ROUTE_CHECK_ACCESS_PASSWORD_CHANGE = 'check-access/<str:token>/'

    def action_check_access_password_change(self, token) -> JsonResponse:
        response = self.__check_token_validity(token)

        if type(response) is JsonResponse:
            return response

        return JsonResponse(
            data={'detail': 'Access granted'},
            status=200,
        )

    @staticmethod
    def __invalidate_tokens() -> None:
        one_time_tokens = OneTimeToken.objects.all()

        for one_time_token in one_time_tokens:
            if one_time_token.expiry_date < (timezone.now() + timezone.timedelta(minutes=20)):
                one_time_token.delete()

    def __check_token_validity(self, token) -> OneTimeToken | JsonResponse:
        if not OneTimeToken.objects.filter(token=token).exists():
            return JsonResponse(
                data={'detail': "You don't have access to this resource"},
                status=401,
            )

        one_time_token = OneTimeToken.objects.filter(token=token).get()

        if one_time_token.expiry_date < timezone.now():
            self.__invalidate_tokens()

            return JsonResponse(
                data={'detail': 'Token has expired'},
                status=401,
            )

        return one_time_token

    ROUTE_CHANGE_PASSWORD = 'change-password/'

    def action_change_password(self, token, new_password):
        form_validator = FormValidator()

        if not form_validator.validate_password(new_password):
            return JsonResponse(
                data={
                    'detail': "Password doesn't follow rules",
                    'validate': False,
                },
                status=200,
            )

        token = OneTimeToken.objects.filter(token=token).get()
        user = User.objects.filter(email=token.email).get()

        user.set_password(new_password)
        user.save()

        token.delete()

        self.__invalidate_tokens()

        return JsonResponse(
            data={
                'detail': 'Password changed successfully',
                'validate': True,
            },
            status=200,
        )

    ROUTE_VERIFY_ACCOUNT = 'verify/<str:token>/'

    def action_verify_account(self, token: str):
        response = self.__check_token_validity(token)

        if type(response) is JsonResponse:
            return response

        user = User.objects.filter(email=response.email).get()
        user.is_active = True
        user.save()

        response.delete()

        return JsonResponse(
            data={'detail': 'Account Verified'},
            status=200,
        )
