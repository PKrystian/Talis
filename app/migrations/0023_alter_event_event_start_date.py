# Generated by Django 5.0.5 on 2024-10-21 16:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0022_boardgame_cluster'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='event_start_date',
            field=models.DateTimeField(),
        ),
    ]
