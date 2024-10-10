from django.db import models
from django.contrib.auth.models import User


class RegisteredUser(models.Model):
    DoesNotExist = None
    objects = None
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    birth_date = models.DateField(null=False)
    profile_image_url = models.URLField(max_length=255, null=True, blank=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = User()

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.user.save()
        super().save(
            force_insert=False,
            force_update=False,
            using=None,
            update_fields=None
        )
