# Generated by Django 5.0.5 on 2024-09-10 18:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0015_alter_userboardgamecollection_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='LogError',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('class_reference', models.CharField(max_length=128)),
                ('message', models.CharField(max_length=1024)),
                ('trigger', models.CharField(max_length=256)),
                ('danger_level', models.CharField(max_length=32)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
            ],
        ),
    ]
