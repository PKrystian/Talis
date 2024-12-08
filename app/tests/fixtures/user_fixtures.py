import pytest

from app.utils.creators.RegisteredUserCreator import RegisteredUserCreator


@pytest.fixture
def new_registered_user_fixture():
    registered_user_creator = RegisteredUserCreator()

    new_registered_user = (
        registered_user_creator
            .create()
            .set_first_name('John')
            .set_last_name('Doe')
            .set_email('johndoe@mail.com')
            .set_password('zaq1@WSX')
            .set_birth_date('2000-12-12')
            .get_registered_user()
    )

    return new_registered_user

@pytest.fixture
def new_registered_users_fixture():
    registered_user_creator = RegisteredUserCreator()

    new_registered_user_1 = (
        registered_user_creator
            .create()
            .set_first_name('Testy')
            .set_last_name('Dawg')
            .set_email('testydawg@mail.com')
            .set_password('zaq1@WSX')
            .set_birth_date('2005-05-05')
            .get_registered_user()
    )

    new_registered_user_2 = (
        registered_user_creator
            .create()
            .set_first_name('Alan')
            .set_last_name('Balan')
            .set_email('alanbalan@mail.com')
            .set_password('zaq1@WSX')
            .set_birth_date('2002-12-12')
            .get_registered_user()
    )

    new_registered_user_3 = (
        registered_user_creator
            .create()
            .set_first_name('Jeff')
            .set_last_name('Beef')
            .set_email('jeffbeef@mail.com')
            .set_password('zaq1@WSX')
            .set_birth_date('2010-12-12')
            .get_registered_user()
    )

    users = [
        new_registered_user_1,
        new_registered_user_2,
        new_registered_user_3,
    ]

    return users
