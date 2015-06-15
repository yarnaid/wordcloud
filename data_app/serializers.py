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


class QuestionIdSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Question
        fields = ('id', 'name')


class VerbatimSerialier(serializers.HyperlinkedModelSerializer):
    parent = CodeIdSerializer()
    variable = VariableSerializer()
    question = QuestionIdSerializer()

    class Meta:
        model = Verbatim
        depth = 1
        fields = ('variable', 'verbatim', 'parent', 'id', 'question')


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


class ShortCodeSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = Code
        depth = 1
        fields = ('text', 'title', 'code', 'id', )
        filter_fields = ('overcode', )


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


class CodesSerializer(serializers.HyperlinkedModelSerializer):
    children_codes = ShortCodeSerializer(many=True)

    class Meta:
        model = CodeBook
        depth = 1
        fields = ('id', 'children_codes', 'name')


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

class QuestionSerializer(serializers.HyperlinkedModelSerializer):
    parent = JobSerializer()
    code_book = CodeBookSerializer()

    class Meta:
        model = Question
        depth = 1
        fields = (
            'name', 'text', 'title', 'kind', 'code_book', 'id',
            'url')
        filter_fields = ('parent', )


class VariableCodesSerializer(serializers.HyperlinkedModelSerializer):
    code_book = CodesSerializer()

    class Meta:
        model = Question
        depth = 1
        fields = ('name', 'text', 'title', 'id', 'code_book')
        filter_fields = ('parent', )


class ShortQuestionSerializer(serializers.HyperlinkedModelSerializer):
    code_book = CodeBookIdSerializer()

    class Meta:
        model = Question
        depth = 1
        fields = ('name', 'text', 'title', 'kind', 'id', 'code_book')

class VisDataSerializer(serializers.HyperlinkedModelSerializer):
    children_questions = QuestionSerializer(many=True)

    class Meta:
        model = Question
        depth = 1
        fields = ('name', 'text', 'title', 'id', 'children_questions', )
