# Generated by Django 3.2.12 on 2022-04-01 22:19

import django.contrib.auth.models
from django.db import migrations
import django.db.models.manager


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion', '0006_alter_emailverification_next_step'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='user',
            managers=[
                ('manager', django.db.models.manager.Manager()),
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
    ]