from rest_framework.serializers import HyperlinkedModelSerializer
from rest_framework.viewsets import ReadOnlyModelViewSet

from fantasion_generics.api import PublicMediaSerializer, media_fields

from . import models


class FlavourTextSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = models.FlavourText
        fields = ['id', 'text', 'quote_owner']


class FlavourTextView(ReadOnlyModelViewSet):
    queryset = models.FlavourText.objects.all()
    serializer_class = FlavourTextSerializer


class StaticArticleMediaSerializer(PublicMediaSerializer):
    class Meta:
        model = models.StaticArticleMedia
        fields = media_fields


class StaticArticleSerializer(HyperlinkedModelSerializer):
    media = StaticArticleMediaSerializer(many=True)

    class Meta:
        model = models.StaticArticle
        fields = ['id', 'title', 'description', 'text', 'key', 'media']


class StaticArticleView(ReadOnlyModelViewSet):
    queryset = models.StaticArticle.objects.all()
    serializer_class = StaticArticleSerializer
    lookup_field = 'key'
