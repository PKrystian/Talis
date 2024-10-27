import pytest
from django.contrib.auth.models import User

from app.models.registered_user import RegisteredUser
from app.utils.FormValidator import FormValidator
from app.utils.creators.RegisteredUserCreator import RegisteredUserCreator


class TestRegisteredUserCreator:
    registered_user_creator: RegisteredUserCreator

    def setup_class(self):
        self.registered_user_creator = RegisteredUserCreator()

    @pytest.fixture
    def user_data_fixture(self):
        yield {
            FormValidator.FORM_FIELD_FIRST_NAME: 'Gus',
            FormValidator.FORM_FIELD_LAST_NAME: 'Fring',
            FormValidator.FORM_FIELD_EMAIL: 'lospolloshermanos@gmail.com',
            FormValidator.FORM_FIELD_PASSWORD: 'elPolloHermanoGuy55!',
            FormValidator.FORM_FIELD_BIRTH_DATE: '1958-07-23',
        }

    @pytest.mark.django_db
    def test_create(self, user_data_fixture):
        new_registered_user = (
            self.registered_user_creator
            .create()
            .set_first_name(user_data_fixture[FormValidator.FORM_FIELD_FIRST_NAME])
            .set_last_name(user_data_fixture[FormValidator.FORM_FIELD_LAST_NAME])
            .set_email(user_data_fixture[FormValidator.FORM_FIELD_EMAIL])
            .set_password(user_data_fixture[FormValidator.FORM_FIELD_PASSWORD])
            .set_birth_date(user_data_fixture[FormValidator.FORM_FIELD_BIRTH_DATE])
            .get_registered_user()
        )

        new_registered_user.save()

        assert(type(new_registered_user) == RegisteredUser)
        assert(type(new_registered_user.user) == User)
        assert(new_registered_user.birth_date == user_data_fixture[FormValidator.FORM_FIELD_BIRTH_DATE])
        assert(new_registered_user.user.email == user_data_fixture[FormValidator.FORM_FIELD_EMAIL])
        assert(new_registered_user.user.username == user_data_fixture[FormValidator.FORM_FIELD_EMAIL])
