import os

from django.utils import timezone
import secrets

from django.db import models


class OneTimeToken(models.Model):
    BASE_TOKEN_URL = 'http://localhost:3000/' if os.getenv("DEVELOPMENT_MODE", "True") == "True" else 'https://talis.live/'
    FRONTEND_FORGOT_PASSWORD_URL = 'forgot-password/'
    FRONTEND_VERIFY_ACCOUNT_URL = 'verify/'

    FORGOT_PASSWORD_URL = BASE_TOKEN_URL + FRONTEND_FORGOT_PASSWORD_URL
    VERIFY_ACCOUNT_URL = BASE_TOKEN_URL + FRONTEND_VERIFY_ACCOUNT_URL

    objects = None
    email = models.CharField(max_length=128, null=False)
    token = models.CharField(max_length=128, null=False)
    expiry_date = models.DateTimeField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.token = self.__generate_unique_token()
        if not self.expiry_date:
            self.expiry_date = timezone.now() + timezone.timedelta(minutes=15)
        super().save(*args, **kwargs)

    @staticmethod
    def __generate_unique_token() -> str:
        generated_token = secrets.token_hex(nbytes=16)

        while OneTimeToken.objects.filter(token=generated_token).exists():
            generated_token = secrets.token_hex(nbytes=16)

        return generated_token