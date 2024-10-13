from app.models.log_error import LogError
from typing import Self


class LogErrorCreator:
    __log_error: LogError

    def create(self) -> Self:
        self.__log_error = LogError()
        return self

    def debug(self) -> Self:
        self.__log_error.set_danger_level(LogError.DEBUG)
        return self

    def warning(self) -> Self:
        self.__log_error.set_danger_level(LogError.WARNING)
        return self

    def critical(self) -> Self:
        self.__log_error.set_danger_level(LogError.CRITICAL)
        return self

    def log(self, message: str,  trigger: str, class_reference: str) -> None:
        self.__log_error.set_message(message)
        self.__log_error.set_trigger(trigger)
        self.__log_error.set_class_reference(class_reference)

        if not self.__log_error.danger_level:
            raise Exception

        self.__log_error.save()
