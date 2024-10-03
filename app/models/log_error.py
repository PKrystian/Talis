from django.db import models


class LogError(models.Model):
    DEBUG = 'DEBUG'
    WARNING = 'WARNING'
    CRITICAL = 'CRITICAL'

    objects = None
    class_reference = models.CharField(max_length=128)
    message = models.CharField(max_length=1024)
    trigger = models.CharField(max_length=256)
    danger_level = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def set_class_reference(self, class_reference: str) -> None:
        self.class_reference = class_reference

    def set_message(self, message: str) -> None:
        self.message = message

    def set_trigger(self, trigger: str) -> None:
        self.trigger = trigger

    def set_danger_level(self, danger_level: str) -> None:
        self.danger_level = danger_level
