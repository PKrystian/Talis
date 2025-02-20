# Generated by Django 5.0.5 on 2024-11-17 21:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0028_alter_invite_event'),
    ]

    operations = [
        migrations.AddField(
            model_name='boardgame',
            name='accepted_by_admin',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='boardgame',
            name='added_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='app.registereduser'),
        ),
    ]
