from django.shortcuts import render

from data_app import models
from rest_framework import viewsets
from data_app import serializers
import rest_framework_filters as filters

# Create your views here.


class JobViewSet(viewsets.ModelViewSet):
    queryset = models.Job.objects.all()
    serializer_class = serializers.JobSerializer
    filter_fields = ('id', 'name', 'number')


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = models.Question.objects.all().prefetch_related('verbatim_set', 'parent')
    serializer_class = serializers.QuestionSerializer
    filter_fields = ('id', 'name', 'code_book', 'parent', 'kind', 'verbatim')


class ShortQuestionViewSet(viewsets.ModelViewSet):
    queryset = models.Question.objects.exclude(kind='Variable').prefetch_related('verbatim_set', 'parent')
    serializer_class = serializers.ShortQuestionSerializer
    filter_fields = ('id', 'parent', 'kind', 'name')


class VariableCodesViewSet(viewsets.ModelViewSet):
    queryset = models.Question.objects.filter(kind='Variable').prefetch_related('verbatim_set', 'parent')
    serializer_class = serializers.VariableCodesSerializer
    filter_fields = ('id', 'parent', 'name')


class CodeBookViewSet(viewsets.ModelViewSet):
    queryset = models.CodeBook.objects.all().prefetch_related('verbatim_set', 'parent', 'code_book')
    serializer_class = serializers.CodeBookSerializer
    filter_fields = ('id', 'name', 'job')


class VariableFilter(filters.FilterSet):
    queryset = models.Variable.objects.all().prefetch_related('job')

    class Meta:
        model = models.Variable
        fields = ('id', 'uid', 'sex', 'age_bands', 'reg_quota', 'csp_quota', 'main_cell_text', 'job')


class VerbatimFilter(filters.FilterSet):
    queryset = models.Verbatim.objects.all().prefetch_related('question', 'variable', 'parent', 'job')

    variable = filters.RelatedFilter(VariableFilter)

    class Meta:
        model = models.Verbatim
        fields = ('parent', 'question', 'variable')


class CodeFilter(filters.FilterSet):
    queryset = models.Code.objects.all().prefetch_related('job', 'code_book', 'parent', 'children_verbatims__question', 'children_verbatims', 'children_verbatims__variable')

    children_verbatims = filters.RelatedFilter(VerbatimFilter)

    class Meta:
        model = models.Code
        fields = ('overcode', 'code_book', 'id', 'job', 'children_verbatims')


class CodeViewSet(viewsets.ModelViewSet):
    queryset = models.Code.objects.all().prefetch_related('job', 'code_book', 'parent', 'children_verbatims__question', 'children_verbatims', 'children_verbatims__variable')
    serializer_class = serializers.CodeSerializer
    filter_fields = ('overcode', 'code_book', 'id', 'job', 'children_verbatims')
    filter_class = CodeFilter


class VerbatimViewSet(viewsets.ModelViewSet):
    queryset = models.Verbatim.objects.all().prefetch_related('parent', 'variable', 'question')
    serializer_class = serializers.VerbatimSerialier
    filter_class = VerbatimFilter


class VariableViewSet(viewsets.ModelViewSet):
    queryset = models.Variable.objects.all()
    serializer_class = serializers.VariableSerializer
    filter_class = VariableFilter


class VisDataViewSet(viewsets.ModelViewSet):
    queryset = models.Job.objects.all()
    serializer_class = serializers.VisDataSerializer
    filter_fields = ('id', 'children_questions')
