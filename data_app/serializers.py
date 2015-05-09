__author__ = 'yarnaid'

from data_app.models import Job, Question, Code, Variable, Verbatim, CodeBook
from rest_framework import serializers


class RecursiveField(serializers.Serializer):
    def to_native(self, value):
        return self.parent.to_native(value)


class JobSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Job
        fields = ('name', 'number', 'id', 'url')


class VariableSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Variable
        fields = ('uid', 'sex', 'age_bands', 'reg_quota',
                  'csp_quota', 'main_cell_text', 'id')


class CodeIdSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Code
        depth = 1
        fields = ('text', 'id')


class VerbatimSerialier(serializers.HyperlinkedModelSerializer):
    parent = CodeIdSerializer()
    variable = VariableSerializer()

    class Meta:
        model = Verbatim
        depth = 1
        fields = ('variable', 'verbatim', 'parent', 'id')


class VerbatimIdSerialier(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Verbatim
        depth = 2
        fields = ('id', 'verbatim')


class CodeBookIdSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = CodeBook
        depth = 5
        fields = ('name', 'id', )


class CodeSerializer(serializers.HyperlinkedModelSerializer):
    children_verbatims = VerbatimSerialier(many=True)
    job = JobSerializer()
    code_book = CodeBookIdSerializer()
    parent = CodeIdSerializer()

    class Meta:
        model = Code
        depth = 1
        fields = ('text', 'title', 'code',
                  'code_book', 'job',
                  'overcode', 'id', 'parent',
                  # 'url',
                  'children_verbatims'
                  )
        filter_fields = ('overcode', )


class CodeBookSerializer(serializers.HyperlinkedModelSerializer):
    job = JobSerializer()
    # children_codes = CodeSerializer()

    class Meta:
        model = CodeBook
        depth = 5
        fields = ('name', 'job', 'id', 'children_codes')


class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    parent = JobSerializer()
    code_book = CodeBookSerializer()

    class Meta:
        model = Question
        depth = 1
        fields = (
            'name', 'text', 'title', 'kind', 'parent', 'code_book', 'id',
            'url')
        filter_fields = ('parent', )
