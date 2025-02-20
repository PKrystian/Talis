from app.models.registered_user import RegisteredUser
from django.contrib.auth.models import User
from typing import Self


class RegisteredUserCreator:
    __registered_user: RegisteredUser

    def create(self) -> Self:
        self.__registered_user = RegisteredUser()
        self.__registered_user.user = User()
        self.__registered_user.user.is_active = False
        return self

    def set_first_name(self, first_name) -> Self:
        self.__registered_user.user.first_name = first_name
        return self

    def set_last_name(self, last_name) -> Self:
        self.__registered_user.user.last_name = last_name
        return self

    def set_email(self, email) -> Self:
        self.__registered_user.user.email = email
        return self

    def set_password(self, password) -> Self:
        self.__registered_user.user.set_password(password)
        return self

    def set_birth_date(self, birth_date) -> Self:
        self.__registered_user.birth_date = birth_date
        return self

    def get_registered_user(self) -> RegisteredUser:
        self.__registered_user.user.username = self.__registered_user.user.email
        return self.__registered_user
