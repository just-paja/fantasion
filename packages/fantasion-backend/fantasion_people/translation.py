from modeltranslation.translator import register, TranslationOptions

from . import models


@register(models.Profile)
class ProfileTranslationOptions(TranslationOptions):
    fields = ('title', 'description')


@register(models.ProfileMedia)
class ProfileMediaTranslationOptions(TranslationOptions):
    fields = ('title', 'description')


@register(models.Allergy)
class AllergyTranslationOptions(TranslationOptions):
    fields = ('title', 'description')


@register(models.Hobby)
class HobbyTranslationOptions(TranslationOptions):
    fields = ('title', 'description')