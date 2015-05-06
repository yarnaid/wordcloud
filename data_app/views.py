from django.shortcuts import render

from data_app import models
from rest_framework import viewsets
from data_app import serializers

# Create your views here.


class JobViewSet(viewsets.ModelViewSet):
    queryset = models.Job.objects.all()
    serializer_class = serializers.JobSerializer
    filter_fields = ('id', 'name', 'number')


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = models.Question.objects.all()
    serializer_class = serializers.QuestionSerializer
    filter_fields = ('id', 'name', 'code_book')


class CodeBookViewSet(viewsets.ModelViewSet):
    queryset = models.CodeBook.objects.all()
    serializer_class = serializers.CodeBookSerializer
    filter_fields = ('id', 'name', 'job')


class CodeViewSet(viewsets.ModelViewSet):
    queryset = models.Code.objects.all()
    serializer_class = serializers.CodeSerializer
    filter_fields = ('overcode', 'code_book')


class VerbatimViewSet(viewsets.ModelViewSet):
    queryset = models.Verbatim.objects.all()
    serializer_class = serializers.VerbatimSerialier
    filter_fields = ('parent', )


class VariableViewSet(viewsets.ModelViewSet):
    queryset = models.Variable.objects.all()
    serializer_class = serializers.VariableSerializer
    filter_fields = ('id', 'uid')
