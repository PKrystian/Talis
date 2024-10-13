import pytest

from app.models.log_error import LogError
from app.utils.creators.LogErrorCreator import LogErrorCreator


class TestLogErrorCreator:
    log_error_creator: LogErrorCreator

    def setup_class(self):
        self.log_error_creator = LogErrorCreator()

    @pytest.mark.django_db
    def test_log_debug(self):
        message = 'Test Debug Log'
        trigger = 'TestCaseDebug'

        (
            self.log_error_creator
            .create()
            .debug()
            .log(message, trigger, str(self.__class__))
        )

        saved_log = LogError.objects.filter(trigger__exact=trigger).get()

        self.__assert(saved_log, message, LogError.DEBUG)

    @pytest.mark.django_db
    def test_log_warning(self):
        message = 'Test Warning Log'
        trigger = 'TestCaseWarning'

        (
            self.log_error_creator
            .create()
            .warning()
            .log(message, trigger, str(self.__class__))
        )

        saved_log = LogError.objects.filter(trigger__exact=trigger).get()

        self.__assert(saved_log, message, LogError.WARNING)

    @pytest.mark.django_db
    def test_log_critical(self):
        message = 'Test Critical Log'
        trigger = 'TestCaseCritical'

        (
            self.log_error_creator
            .create()
            .critical()
            .log(message, trigger, str(self.__class__))
        )

        saved_log = LogError.objects.filter(trigger__exact=trigger).get()

        self.__assert(saved_log, message, LogError.CRITICAL)

    @staticmethod
    def __assert(saved_log, message, danger_level):
        assert(type(saved_log) == LogError)
        assert(saved_log.message == message)
        assert(saved_log.danger_level == danger_level)