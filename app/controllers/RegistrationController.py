from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, QueryDict

from app.utils.FormValidator import FormValidator
from django.contrib.auth.models import User
from app.utils.RegisteredUserCreator import RegisteredUserCreator


class RegistrationController:
    ROUTE = 'register/'

    def action_register(self, form_data: QueryDict) -> HttpResponse:
        form_validator = FormValidator()

        if not form_validator.validate(form_data):
            response = HttpResponse('Failed to register')
            response.status_code = 400
            return response

        if self.__check_for_existing_user(form_data[FormValidator.FORM_FIELD_EMAIL]):
            response = HttpResponse('User with this email already exists')
            response.status_code = 400
            return response

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

        response = HttpResponse('Registered successfully')
        response.status_code = 200
        return response

    @staticmethod
    def __check_for_existing_user(username: str) -> bool:
        try:
            User.objects.filter(username__exact=username).get()
            return True
        except ObjectDoesNotExist:
            return False
