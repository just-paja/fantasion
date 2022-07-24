# Generated by Django 3.2.13 on 2022-07-23 21:21

from django.db import migrations, models
import django.db.models.deletion
import fantasion_generics.media
import fantasion_generics.models
import fantasion_generics.photos
import fantasion_generics.titles
import fantasion_generics.upload_path
import fantasion_generics.videos


class Migration(migrations.Migration):

    dependencies = [
        ('fantasion_locations', '0004_country_code'),
        ('fantasion_expeditions', '0016_auto_20220205_1523'),
    ]

    operations = [
        migrations.CreateModel(
            name='TransportVehicle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('brand', models.CharField(blank=True, max_length=128, null=True, verbose_name='Vehicle Brand')),
                ('model', models.CharField(blank=True, max_length=128, null=True, verbose_name='Vehicle Model')),
                ('year', models.PositiveIntegerField(blank=True, null=True, verbose_name='Vehicle Manufactured Year')),
                ('color', models.CharField(blank=True, max_length=128, null=True, verbose_name='Vehicle Colour')),
                ('public', fantasion_generics.models.VisibilityField(default=True, help_text='Public objects will be visible on the website', verbose_name='Public')),
                ('description', fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description')),
            ],
            options={
                'verbose_name': 'Transport Vehicle',
                'verbose_name_plural': 'Transport Vehicles',
            },
        ),
        migrations.CreateModel(
            name='TransportVehicleMedia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('height', models.PositiveBigIntegerField(blank=True, null=True, verbose_name='Height')),
                ('width', models.PositiveBigIntegerField(blank=True, null=True, verbose_name='Width')),
                ('local_photo', fantasion_generics.photos.LocalPhotoField(blank=True, height_field='height', max_length=255, null=True, upload_to=fantasion_generics.upload_path.get_upload_path, verbose_name='Image file', width_field='width')),
                ('local_video', fantasion_generics.videos.VideoField(blank=True, duration_field='duration', height_field='height', max_length=255, null=True, upload_to=fantasion_generics.upload_path.get_upload_path, verbose_name='Video file', width_field='width')),
                ('duration', models.PositiveBigIntegerField(blank=True, null=True)),
                ('description', fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description')),
                ('parent', fantasion_generics.media.MediaParentField(on_delete=django.db.models.deletion.CASCADE, related_name='media', to='fantasion_expeditions.transportvehicle', verbose_name='Parent object')),
            ],
            options={
                'verbose_name': 'Media Object',
                'verbose_name_plural': 'Media Objects',
                'abstract': False,
            },
            bases=(models.Model, fantasion_generics.photos.WarmPhotoModel),
        ),
        migrations.CreateModel(
            name='Transport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', fantasion_generics.titles.FacultativeDescriptionField(blank=True, help_text='Describe this in a couple of sentences. Use Markdown if necessary, but keeping this a plain text will yield better results', null=True, verbose_name='Short Description')),
                ('departs_at', models.DateTimeField(blank=True, null=True, verbose_name='Departs at')),
                ('arrives_at', models.DateTimeField(blank=True, null=True, verbose_name='Arrives at')),
                ('gps_tracking_url', models.URLField(blank=True, null=True, verbose_name='GPS Tracking URL')),
                ('public', fantasion_generics.models.VisibilityField(default=True, help_text='Public objects will be visible on the website', verbose_name='Public')),
                ('arrives_to', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='expedition_transport_destinations', to='fantasion_locations.location', verbose_name='Arrives to')),
                ('departs_from', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='expedition_transports', to='fantasion_locations.location', verbose_name='Departs from')),
                ('vehicle', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.RESTRICT, to='fantasion_expeditions.transportvehicle', verbose_name='Transport Vehicle')),
            ],
            options={
                'verbose_name': 'Transport',
                'verbose_name_plural': 'Transports',
            },
        ),
    ]