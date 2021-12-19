from django.db.models import Model, ImageField
from django.utils.translation import ugettext_lazy as _

from .upload_path import get_upload_path
from .storages import private_storage


class LocalPhotoModel(Model):
    class Meta:
        abstract = True

    local_photo = ImageField(
        blank=True,
        height_field='height',
        max_length=255,
        null=True,
        upload_to=get_upload_path,
        verbose_name=_('Image file'),
        width_field='width',
    )


class PrivatePhotoModel(Model):
    class Meta:
        abstract = True

    private_photo = ImageField(
        blank=True,
        height_field='height',
        max_length=255,
        null=True,
        storage=private_storage,
        upload_to=get_upload_path,
        verbose_name=_('Image file'),
        width_field='width',
    )
