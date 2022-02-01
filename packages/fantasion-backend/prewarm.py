import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fantasion.settings')

import django
import django.apps

django.setup()

from fantasion_generics.photos import LocalPhotoModel, warm_model


def warm_all_instances(model):
    instances = model.objects.all()
    for inst in instances:
        warm_model(model, inst)


def main():
    for model in django.apps.apps.get_models():
        if issubclass(model, LocalPhotoModel):
            warm_all_instances(model)


if __name__ == '__main__':
    main()