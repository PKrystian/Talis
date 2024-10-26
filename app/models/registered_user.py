from django.db import models
from django.contrib.auth.models import User


class RegisteredUser(models.Model):
    DoesNotExist = None
    objects = None
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    birth_date = models.DateField(null=False)
    profile_image_url = models.URLField(max_length=255, null=True, blank=True)
    cookie_consent = models.BooleanField(null=True, default=None)

    def save(self, *args, **kwargs):
        self.user.save()
        super().save(*args, **kwargs)