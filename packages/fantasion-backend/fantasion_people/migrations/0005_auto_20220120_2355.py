# Generated by Django 3.2.11 on 2022-01-20 22:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_people', '0004_auto_20220118_2243'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profilemedia',
            name='created',
        ),
        migrations.RemoveField(
            model_name='profilemedia',
            name='modified',
        ),
        migrations.RemoveField(
            model_name='profilemedia',
            name='title',
        ),
        migrations.RemoveField(
            model_name='profilemedia',
            name='title_cs',
        ),
        migrations.RemoveField(
            model_name='profilemedia',
            name='title_en',
        ),
    ]