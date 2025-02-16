# Generated by Django 5.0.5 on 2024-05-30 23:03

import app.models.board_game
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='BoardGame',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=256, unique=True)),
                ('year_published', models.PositiveSmallIntegerField(null=True)),
                ('publisher', models.CharField(max_length=128, null=True)),
                ('category', models.JSONField(default=app.models.board_game.default_category)),
                ('mechanic', models.JSONField(default=app.models.board_game.default_mechanic)),
                ('min_players', models.PositiveSmallIntegerField(default=0, null=True)),
                ('max_players', models.PositiveSmallIntegerField(default=0, null=True)),
                ('age', models.PositiveSmallIntegerField(default=0, null=True)),
                ('min_playtime', models.PositiveIntegerField(default=0, null=True)),
                ('max_playtime', models.PositiveIntegerField(default=0, null=True)),
                ('expansion', models.JSONField(default=app.models.board_game.default_expansion)),
                ('description', models.TextField(default='', null=True)),
                ('image_url', models.CharField(max_length=256, null=True, unique=True)),
            ],
        ),
        migrations.DeleteModel(
            name='Animal',
        ),
    ]
