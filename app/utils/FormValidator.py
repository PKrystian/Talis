from django.http import QueryDict

import re


class FormValidator:
    __email_pattern = r"^\S+@\S+\.\S+$"
    __password_pattern = r'[A-Za-z0-9@#$%^&+=!":\']{8,}'

    FORM_FIELD_FIRST_NAME = 'firstName'
    FORM_FIELD_LAST_NAME = 'lastName'
    FORM_FIELD_EMAIL = 'email'
    FORM_FIELD_PASSWORD = 'password'
    FORM_FIELD_BIRTH_DATE = 'birthDate'

    FORM_REQUIRED_FIELDS = [
        FORM_FIELD_FIRST_NAME,
        FORM_FIELD_EMAIL,
        FORM_FIELD_PASSWORD,
        FORM_FIELD_BIRTH_DATE,
    ]

    def validate(self, form_data: QueryDict) -> bool:
        if all([field in form_data.keys() for field in self.FORM_REQUIRED_FIELDS]):
            if (self.__validate_email(form_data[self.FORM_FIELD_EMAIL])
                    and self.__validate_password(form_data[self.FORM_FIELD_PASSWORD])):
                return True
        return False

    def __validate_email(self, email: str) -> bool:
        if re.fullmatch(self.__email_pattern, email):
            return True
        return False

    def __validate_password(self, password: str) -> bool:
        if re.fullmatch(self.__password_pattern, password):
            return True
        return False
