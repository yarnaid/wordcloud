__author__ = 'yarnaid'

from data_app.models import Job, Question, Code, Variable, Verbatim, CodeBook
from rest_framework import serializers


class JobSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Job
        fields = ('name', 'number')


class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Question
        fields = ('name', 'text', 'title', 'kind', 'parent', 'code_book')


class CodeBookSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CodeBook
        fields = ('name', 'job')


class CodeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Code
        fields = ('text', 'title', 'code', 'code_book', 'job', 'overcode')


class VerbatimSerialier(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Verbatim
        fields = ('question', 'variable', 'verbatim', 'parent', 'job')


class VariableSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Variable
        fields = ('uid', 'sex', 'age_bands', 'reg_quota', 'csp_quota', 'main_cell_text', 'job')