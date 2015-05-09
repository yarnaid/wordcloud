__author__ = 'yarnaid'

from data_app.models import Job, Question, Code, Variable, Verbatim, CodeBook
from rest_framework import serializers


class JobSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Job
        fields = ('name', 'number', 'id', 'url')


class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Question
        fields = ('name', 'text', 'title', 'kind', 'parent', 'code_book', 'id', 'url')


class CodeBookSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CodeBook
        fields = ('name', 'job', 'id', 'url')


class VariableSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Variable
        fields = ('uid', 'sex', 'age_bands', 'reg_quota', 'csp_quota', 'main_cell_text', 'job', 'id', 'url')


class VerbatimSerialier(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Verbatim
        fields = ('question', 'variable', 'verbatim', 'parent', 'job', 'id', 'url')


class V2(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Verbatim
        fields = ('verbatim', )


class CodeSerializer(serializers.HyperlinkedModelSerializer):
    # children_verbatims = VerbatimSerialier('children_verbatims')
    class Meta:
        model = Code
        depth = 1
        fields = ('text', 'title', 'code', 'code_book', 'job', 'overcode', 'id', 'parent', 'url', 'children_verbatims')
        filter_fields = ('overcode', )
