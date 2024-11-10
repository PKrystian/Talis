from app.models import FriendList
from app.models.invite import Invite


class InviteDataGetter:
    def get_data_for_invite(self, invite: Invite) -> dict:
        if invite.type in Invite.INVITE_EVENT_RELATION:
            return self.__get_event_invite_data(invite)
        if invite.type == Invite.INVITE_TYPE_NEW_FRIEND_REQUEST:
            return self.__get_friend_request_invite_data(invite)

    @staticmethod
    def __get_event_invite_data(invite: Invite) -> dict:
        board_game_image_url = ''

        if invite.event.board_games.exists():
            board_game_image_url = invite.event.board_games.first().image_url

        data = {
            'id': invite.id,
            'type': invite.type,
            'status': invite.status,
            'friend': {
                'id': invite.user.id,
                'first_name': invite.user.first_name,
                'last_name': invite.user.last_name,
                'profile_image_url': invite.user.registereduser.profile_image_url
            },
            'event': {
                'id': invite.event.id,
                'title': invite.event.title,
                'image_url': board_game_image_url,
            }
        }

        return data

    @staticmethod
    def __get_friend_request_invite_data(invite: Invite) -> dict:
        data = {
            'id': invite.id,
            'type': invite.type,
            'status': invite.status,
            'friend': {
                'id': invite.user.id,
                'first_name': invite.user.first_name,
                'last_name': invite.user.last_name,
                'profile_image_url': invite.user.registereduser.profile_image_url
            },
        }

        return data
