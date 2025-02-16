from django.http import QueryDict

import re


class FormValidator:
    __email_pattern = r"^\S+@\S+\.\S+$"
    __password_pattern = r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'

    FORM_FIELD_FIRST_NAME = 'firstName'
    FORM_FIELD_LAST_NAME = 'lastName'
    FORM_FIELD_EMAIL = 'email'
    FORM_FIELD_PASSWORD = 'password'
    FORM_FIELD_BIRTH_DATE = 'birthDate'

    REGISTER_FORM_REQUIRED_FIELDS = [
        FORM_FIELD_FIRST_NAME,
        FORM_FIELD_EMAIL,
        FORM_FIELD_PASSWORD,
        FORM_FIELD_BIRTH_DATE,
    ]

    LOGIN_FORM_REQUIRED_FIELDS = [
        FORM_FIELD_EMAIL,
        FORM_FIELD_PASSWORD,
    ]

    def validate_registration(self, form_data: QueryDict) -> bool:
        if all([field in form_data.keys() for field in self.REGISTER_FORM_REQUIRED_FIELDS]):
            if (self.validate_email(form_data[self.FORM_FIELD_EMAIL])
                    and self.validate_password(form_data[self.FORM_FIELD_PASSWORD])):
                return True
        return False

    def validate_login(self, form_data: QueryDict) -> bool:
        if all([field in form_data.keys() for field in self.LOGIN_FORM_REQUIRED_FIELDS]):
            if (self.validate_email(form_data[self.FORM_FIELD_EMAIL])
                    and self.validate_password(form_data[self.FORM_FIELD_PASSWORD])):
                return True
        return False

    def validate_email(self, email: str) -> bool:
        if re.fullmatch(self.__email_pattern, email):
            return True
        return False

    def validate_password(self, password: str) -> bool:
        if re.fullmatch(self.__password_pattern, password):
            return True
        return False
