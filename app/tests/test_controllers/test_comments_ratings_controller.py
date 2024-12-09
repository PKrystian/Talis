import json

import pytest

from app.controllers.CommentsRatingsController import CommentsRatingsController
from app.models import CommentsRatings


class TestCommentsRatingsController:
    comments_ratings_controller: CommentsRatingsController

    def setup_class(self):
        self.comments_ratings_controller = CommentsRatingsController()

    @pytest.mark.parametrize(
        'comment_string, comment_rating',
        [
            ('New cool comment on a game', 5.7),
            (None, 9),
            ('New cool comment on a game', None),
        ],
    )
    @pytest.mark.django_db
    def test_action_add_comment(self, new_registered_user_fixture, actual_board_game_fixture, comment_string, comment_rating):
        new_registered_user_fixture.save()
        actual_board_game_fixture.save()

        result = self.comments_ratings_controller.action_add_comment(
            user_id=new_registered_user_fixture.user.id,
            board_game_id=actual_board_game_fixture.id,
            comment_str=comment_string,
            rating_fl=comment_rating,
        )

        comments = CommentsRatings.objects.filter(board_game_id=actual_board_game_fixture.id).all()

        assert(result.status_code == 200)
        assert(len(comments) == 1)
        assert(comments[0].comment == comment_string)
        assert(comments[0].rating == comment_rating)

    @pytest.mark.django_db
    def test_action_get_comments(self, new_registered_user_fixture, actual_board_game_fixture):
        new_registered_user_fixture.save()
        actual_board_game_fixture.save()

        CommentsRatings.objects.create(
            user=new_registered_user_fixture.user,
            board_game=actual_board_game_fixture,
            comment='This is definitely a comment on a game',
            rating=5.7,
        )

        CommentsRatings.objects.create(
            user=new_registered_user_fixture.user,
            board_game=actual_board_game_fixture,
            comment='Comment on a game',
            rating=9,
        )

        CommentsRatings.objects.create(
            user=new_registered_user_fixture.user,
            board_game=actual_board_game_fixture,
            comment=None,
            rating=13,
        )

        result = self.comments_ratings_controller.action_get_comments(actual_board_game_fixture.id)
        data = json.loads(result.getvalue())

        assert(result.status_code == 200)
        assert(len(data['comments']) == 3)

    @pytest.mark.parametrize(
        'comment_string, comment_rating, changed_comment, changed_rating',
        [
            ('New cool comment on a game', 5.7, 'Changed comment', None),
            (None, 9, 'Actual comment instead', None),
            ('New cool comment on a game', None, '', 10),
        ],
    )
    @pytest.mark.django_db
    def test_action_update_comment(self, new_registered_user_fixture, actual_board_game_fixture, comment_string, comment_rating, changed_comment, changed_rating):
        new_registered_user_fixture.save()
        actual_board_game_fixture.save()

        new_comment = CommentsRatings.objects.create(
            user=new_registered_user_fixture.user,
            board_game=actual_board_game_fixture,
            comment=comment_string,
            rating=comment_rating,
        )

        result = self.comments_ratings_controller.action_update_comment(
            new_comment.id,
            changed_comment,
            changed_rating,
        )

        comments = CommentsRatings.objects.filter(board_game_id=actual_board_game_fixture.id).all()

        assert(result.status_code == 200)
        assert(len(comments) == 1)
        assert(comments[0].comment == changed_comment)
        assert(comments[0].rating == changed_rating)

    @pytest.mark.django_db
    def test_action_delete_comment(self, new_registered_user_fixture, actual_board_game_fixture):
        new_registered_user_fixture.save()
        actual_board_game_fixture.save()

        new_comment = CommentsRatings.objects.create(
            user=new_registered_user_fixture.user,
            board_game=actual_board_game_fixture,
            comment='New comment on a game',
            rating=9.6,
        )

        result = self.comments_ratings_controller.action_delete_comment(new_comment.id)

        comments = CommentsRatings.objects.filter(board_game_id=actual_board_game_fixture.id).all()

        assert(result.status_code == 200)
        assert(len(comments) == 0)

    @pytest.mark.django_db
    def test_action_get_user_ratings_calculated(self, new_registered_user_fixture, actual_board_game_fixture):
        new_registered_user_fixture.save()
        actual_board_game_fixture.save()

        CommentsRatings.objects.create(
            user=new_registered_user_fixture.user,
            board_game=actual_board_game_fixture,
            comment='New comment on a game',
            rating=5,
        )

        CommentsRatings.objects.create(
            user=new_registered_user_fixture.user,
            board_game=actual_board_game_fixture,
            comment='New comment on a game',
            rating=10,
        )

        CommentsRatings.objects.create(
            user=new_registered_user_fixture.user,
            board_game=actual_board_game_fixture,
            comment='New comment on a game',
            rating=3,
        )

        result = self.comments_ratings_controller.action_get_user_ratings_calculated(actual_board_game_fixture.id)
        data = json.loads(result.getvalue())

        assert(result.status_code == 200)
        assert(data['average_rating'] == 6.0)
