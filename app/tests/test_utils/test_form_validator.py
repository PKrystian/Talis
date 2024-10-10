from pickle import FALSE

import pytest

from app.utils.FormValidator import FormValidator


class TestFormValidator:
    form_validator: FormValidator

    def setup_class(self):
        self.form_validator = FormValidator()

    @pytest.mark.parametrize(
        'registration_input, expected',
        [
            (
                {
                    FormValidator.FORM_FIELD_FIRST_NAME: 'Nick',
                    FormValidator.FORM_FIELD_LAST_NAME: 'Bagawski',
                    FormValidator.FORM_FIELD_EMAIL: 'thismailisGooD@gmail.com',
                    FormValidator.FORM_FIELD_PASSWORD: 'thisPasswordBetterBeGood1!',
                    FormValidator.FORM_FIELD_BIRTH_DATE: '2000-12-12'
                },
                True
            ),
            (
                {
                    FormValidator.FORM_FIELD_FIRST_NAME: 'Nick',
                    FormValidator.FORM_FIELD_LAST_NAME: 'Bagawski',
                    FormValidator.FORM_FIELD_EMAIL: 'email.email.email.mail.com',
                    FormValidator.FORM_FIELD_PASSWORD: 'thisPasswordBetterBeGood1!',
                    FormValidator.FORM_FIELD_BIRTH_DATE: '2000-12-12'
                },
                False
            ),
            (
                {
                    FormValidator.FORM_FIELD_FIRST_NAME: 'Nick',
                    FormValidator.FORM_FIELD_EMAIL: 'thismailisGooD@gmail.com',
                    FormValidator.FORM_FIELD_PASSWORD: 'thisPasswordBetterBeGood1!',
                    FormValidator.FORM_FIELD_BIRTH_DATE: '2000-12-12'
                },
                True
            ),
            (
                {
                    FormValidator.FORM_FIELD_FIRST_NAME: 'Nick',
                    FormValidator.FORM_FIELD_EMAIL: 'thismailisGooD@gmail.com',
                    FormValidator.FORM_FIELD_PASSWORD: 'rubbish_password32',
                    FormValidator.FORM_FIELD_BIRTH_DATE: '2000-12-12'
                },
                False
            ),
        ]
    )
    def test_validate_registration(self, registration_input, expected):
        result = self.form_validator.validate_registration(registration_input)
        assert(result == expected)

    @pytest.mark.parametrize(
        'login_input, expected',
        [
            (
                    {
                        FormValidator.FORM_FIELD_EMAIL: 'goodemail@gmail.com',
                        FormValidator.FORM_FIELD_PASSWORD: 'masterofMeN64!',
                    },
                    True
            ),
            (
                    {
                        FormValidator.FORM_FIELD_EMAIL: 'rubbishemail.com',
                        FormValidator.FORM_FIELD_PASSWORD: 'masterofMeN64!',
                    },
                    False
            ),
            (
                    {
                        FormValidator.FORM_FIELD_EMAIL: 'goodemail@gmail.com',
                        FormValidator.FORM_FIELD_PASSWORD: 'badpassword',
                    },
                    False
            )
        ]
    )
    def test_validate_login(self, login_input, expected):
        result = self.form_validator.validate_login(login_input)
        assert(result == expected)
