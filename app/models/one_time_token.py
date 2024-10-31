from django.utils import timezone
import secrets

from django.db import models


class OneTimeToken(models.Model):
    objects = None
    email = models.CharField(max_length=128, null=False)
    token = models.CharField(max_length=128, null=False)
    expiry_date = models.DateTimeField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.token = self.__generate_unique_token()
        self.expiry_date = timezone.now() + timezone.timedelta(minutes=5)
        super().save(*args, **kwargs)

    @staticmethod
    def __generate_unique_token() -> str:
        generated_token = secrets.token_hex(nbytes=16)

        while OneTimeToken.objects.filter(token=generated_token).exists():
            generated_token = secrets.token_hex(nbytes=16)

        return generated_token