# Generated by Django 5.0.5 on 2024-11-07 09:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0027_onetimetoken'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invite',
            name='event',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='app.event'),
        ),
    ]
