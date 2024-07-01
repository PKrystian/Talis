from django.core.management.base import BaseCommand
from app.models import BoardGame, Category, Mechanic, BoardGameExpansion, Publisher, BoardGameMechanic, \
    BoardGameCategory, BoardGamePublisher


class Command(BaseCommand):
    help = 'Migrate board game data including publishers, categories, mechanics, and expansions'

    def add_arguments(self, parser) -> None:
        parser.add_argument(
            '--start_id',
            type=int,
            default=0,
            help='Starting BoardGame ID for migration'
        )
        parser.add_argument(
            '--skip_to',
            type=str,
            default=0,
            help='Skip to a specific step: publishers, categories, mechanics, expansions'
        )

    def handle(self, *args, **kwargs) -> None:
        start_id = kwargs.get('start_id', 0)
        skip_to = kwargs.get('skip_to')

        if skip_to == 'publishers':
            self.migrate_publishers(start_id)
        elif skip_to == 'categories':
            self.migrate_categories(start_id)
        elif skip_to == 'mechanics':
            self.migrate_mechanics(start_id)
        elif skip_to == 'expansions':
            self.migrate_expansions(start_id)
        elif skip_to == 0:
            self.migrate_publishers(start_id)
            self.migrate_categories(start_id)
            self.migrate_mechanics(start_id)
            self.migrate_expansions(start_id)
        else:
            self.stderr.write('Invalid --skip_to argument. Options: publishers, categories, mechanics, expansions')

    def migrate_publishers(self, start_id) -> None:
        games = BoardGame.objects.filter(id__gte=start_id)
        total_games = games.count()
        for idx, game in enumerate(games, start=1):
            publisher = game.publisher
            if publisher:
                publisher_obj, created = Publisher.objects.get_or_create(name=publisher)
                board_game_publisher, created = BoardGamePublisher.objects.get_or_create(
                    board_game=game,
                    publisher=publisher_obj
                )
                self.stdout.write(f'Publisher migrated for BoardGame ID {game.id} ({idx}/{total_games})')

    def migrate_categories(self, start_id) -> None:
        games = BoardGame.objects.filter(id__gte=start_id)
        total_games = games.count()
        for idx, game in enumerate(games, start=1):
            categories = game.category['category']
            for category_name in categories:
                category, created = Category.objects.get_or_create(name=category_name)
                BoardGameCategory.objects.get_or_create(board_game=game, category=category)
            self.stdout.write(f'Categories migrated for BoardGame ID {game.id} ({idx}/{total_games})')

    def migrate_mechanics(self, start_id) -> None:
        games = BoardGame.objects.filter(id__gte=start_id)
        total_games = games.count()
        for idx, game in enumerate(games, start=1):
            mechanics = game.mechanic['mechanic']
            for mechanic_name in mechanics:
                mechanic, created = Mechanic.objects.get_or_create(name=mechanic_name)
                BoardGameMechanic.objects.get_or_create(board_game=game, mechanic=mechanic)
            self.stdout.write(f'Mechanics migrated for BoardGame ID {game.id} ({idx}/{total_games})')

    def migrate_expansions(self, start_id) -> None:
        games = BoardGame.objects.filter(id__gte=start_id)
        total_games = games.count()
        for idx, game in enumerate(games, start=1):
            expansions = game.expansion['expansion']
            if expansions:
                main_game = BoardGame.objects.filter(name=game.name).first()
                for expansion_name in expansions:
                    try:
                        expansion_game = BoardGame.objects.filter(name=expansion_name).first()
                    except BoardGame.DoesNotExist:
                        expansion_game = BoardGame(name=expansion_name)
                        expansion_game.save()
                    if expansion_game:
                        if not BoardGameExpansion.objects.filter(
                                main_board_game=main_game,
                                expansion_board_game=expansion_game
                        ).exists():
                            BoardGameExpansion.objects.create(
                                main_board_game=main_game,
                                expansion_board_game=expansion_game
                            )
            self.stdout.write(f'Expansions migrated for BoardGame ID {game.id} ({idx}/{total_games})')
