from django.db.models import Model, ImageField, PositiveBigIntegerField
from django.utils.translation import ugettext_lazy as _

from .upload_path import get_upload_path


class LocalPhotoModel(Model):
    class Meta:
        abstract = True

    local_photo_image = ImageField(
        blank=True,
        height_field='local_photo_height',
        max_length=255,
        null=True,
        upload_to=get_upload_path,
        verbose_name=_('Image file'),
        width_field='local_photo_width',
    )
    local_photo_height = PositiveBigIntegerField(blank=True, null=True)
    local_photo_width = PositiveBigIntegerField(blank=True, null=True)

