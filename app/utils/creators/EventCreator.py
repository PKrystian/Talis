from typing import Self

from app.models.event import Event


class EventCreator:
    __event: Event

    def create(self) -> Self:
        self.__event = Event()
        return self

    def load_from_dict(self, dict_data: dict) -> Self:
        for key, value in dict_data.items():
            self.__event.setter_mapper[key](value)

        return self

    def get_event(self) -> Event:
        return self.__event
