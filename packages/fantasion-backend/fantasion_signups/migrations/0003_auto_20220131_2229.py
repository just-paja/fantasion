# Generated by Django 3.2.11 on 2022-01-31 21:29

from django.db import migrations
import fantasion_generics.titles


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_signups', '0002_auto_20220116_1915'),
    ]

    operations = [
        migrations.AlterField(
            model_name='signupdocumenttype',
            name='description',
            field=fantasion_generics.titles.DescriptionField(help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='signupdocumenttype',
            name='description_cs',
            field=fantasion_generics.titles.DescriptionField(help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
        migrations.AlterField(
            model_name='signupdocumenttype',
            name='description_en',
            field=fantasion_generics.titles.DescriptionField(help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description'),
        ),
    ]