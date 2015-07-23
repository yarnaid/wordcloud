from collections import deque

from django.db.models import Count
from data_app import models
from rest_framework import viewsets
from data_app import serializers
import rest_framework_filters as filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
import json

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
    queryset = models.Code.objects.all().prefetch_related('job', 'code_book', 'parent', 'children_verbatims__question',
                                                          'children_verbatims', 'children_verbatims__variable')

    children_verbatims = filters.RelatedFilter(VerbatimFilter)

    class Meta:
        model = models.Code
        fields = ('overcode', 'code_book', 'id', 'job', 'children_verbatims')


class CodeViewSet(viewsets.ModelViewSet):
    queryset = models.Code.objects.all().prefetch_related('job', 'code_book', 'parent', 'children_verbatims__question',
                                                          'children_verbatims', 'children_verbatims__variable')
    serializer_class = serializers.CodeSerializer
    filter_fields = ('overcode', 'code_book', 'id', 'job', 'children_verbatims')
    filter_class = CodeFilter


class VerbatimViewSet(viewsets.ModelViewSet):
    queryset = models.Verbatim.objects.all().prefetch_related('parent', 'variable', 'question')
    serializer_class = serializers.VerbatimSerializer
    filter_class = VerbatimFilter


class VariableViewSet(viewsets.ModelViewSet):
    queryset = models.Variable.objects.all()
    serializer_class = serializers.VariableSerializer
    filter_class = VariableFilter

class VisDataViewSet(viewsets.ModelViewSet):
    queryset = models.Job.objects.all()
    serializer_class = serializers.VisDataSerializer
    filter_fields = ('id', 'children_questions')

class SubnetVerbatims(viewsets.ModelViewSet):
    queryset = models.Code.objects.all().prefetch_related('children_codes')
    serializer_class = serializers.SubnetVerbatims
    filter_fields = ('id',)

class JointVerbatims(generics.ListCreateAPIView):
    serializer_class = serializers.VerbatimSerializer

    def get_queryset(self):
        target = self.request.query_params["target"]
        source = self.request.query_params["source"]

        verbatims_source = models.Verbatim.objects.filter(parent_id=source)
        
        variables_source = verbatims_source.select_related('variable').values_list("variable_id", flat=True)
        
        verbatims_target = models.Verbatim.objects.filter(parent_id=target, variable_id__in=variables_source)
        variables_target = verbatims_target.values_list('variable_id', flat=True)
        verbatims_source = verbatims_source.filter(variable_id__in=variables_target)        
        return verbatims_source | verbatims_target

class CoocurrenceView(APIView):
    ''' Allows to get coocurences graph. Only method is get(), overrided from base class.
        Returns object, that has two properties - 'links' and 'nodes'.
            - 'nodes' is a list of graph nodes, that contains information about each node.
            - 'links' is a list of links, that are objects consisting of three properties - 'source', 'target' and
        'value':
            - 'source' - index of node in 'nodes' array the link comes from
            - 'source' - index of node in 'nodes' array the link comes to
            - 'value' - weight of link
    '''
    def get(self, request):
        query_params = request.QUERY_PARAMS.dict()
        query_params.pop('format', None)
        query_params.pop('visualization', None)
        question_id = query_params.pop('question', None)
        job_id = query_params.pop("job", None)
        question = models.Question.objects.get(pk=question_id, parent__pk=job_id)
        if len(query_params.keys()) != 0:
            #import ipdb; ipdb.set_trace()
            variables = models.Variable.objects.filter(job_id=job_id, **query_params)
            verbatims = models.Verbatim.objects.filter(question=question, variable__in = variables)
        else:
            verbatims = models.Verbatim.objects.filter(question=question)

        codes = [(v.parent, v.variable) for v in verbatims]
        codes_variables = dict()
        for code in codes:
            if code[0] not in codes_variables.keys():
                codes_variables[code[0]] = list()
                codes_variables[code[0]] = list()

            codes_variables[code[0]].append(code[1])

        links = list()
        nodes = list()
        node_id__index = dict()
        rest_of_codes = codes_variables.copy()
        for code, ls_of_variables in codes_variables.iteritems():
            rest_of_codes.pop(code, None)

            if code.id not in node_id__index.keys():
                if len(ls_of_variables)>0:
                    nodes.append({
                        'id': code.id,
                        'title': code.title,
                        'verbatim_count': len(ls_of_variables),
                        'question_id': question_id
                    })  
                    index = len(nodes)-1
                    node_id__index[code.id] = index
                else: 
                    continue
            else:
                index = node_id__index[code.id]

            for another_code, another_ls_of_variables in rest_of_codes.iteritems():
                count = 0
                for verbatim in ls_of_variables:
                    if verbatim in another_ls_of_variables:
                        count += 1

                if another_code.id in node_id__index.keys():
                    to = node_id__index[another_code.id]
                else:
                    nodes.append({
                        'id': another_code.id,
                        'title': another_code.title,
                        'verbatim_count': len(another_ls_of_variables),
                        'question_id': question_id
                    })
                    to = len(nodes)-1
                    node_id__index[another_code.id] = to

                if count>0:
                    links.append({"source": index, 
                                  "target": to,
                                  "value": count,
                                  "question_id": question_id});


        return Response({"nodes": nodes, "links": links, "question": {"verbatim_count": len(verbatims)}})

class VerbatimsFilteredSet(APIView):
    ''' Class appointed to fast access to Verbatims statistics and data

        Supports GET method with URL query parameters format:
        /visualization_data?job={job Id}&id={question Id}[&{field name of Variable}={restriction value for field}]

        For example:
        /visualization_data?job=126&id=3&age_bands=3&csp_quota=2
        '''
    #TODO: Is there any possibility to simplify names of fields in Variable class (such as 'reg_quota' to 'reg', 'csp_quota' to csp, etc)?

    def get(self, request, format=None):
        params = dict(request.query_params)
        params.pop('format', None)
        params.pop('visualization', None)
        print params
        query_parameters_dict = {key: int(value[0]) for key, value in params.iteritems()}
        job = models.Job.objects.get(pk=int(query_parameters_dict['job']))

        question = models.Question.objects.get(pk=int(query_parameters_dict['question']))
        code_book = question.code_book

        response_body = {
            'job_number': job.number,
            'job_name': job.name,
            'question': {
                'codebook_name': code_book.name,
                'title': question.title,
                'text': question.text,
                'name': question.name,
                'kind': question.kind,
                'verbatim_count': 0,
            }
        }

        query_parameters_dict.pop('question')
        query_parameters_dict.pop('job')
        query_parameters_dict.pop('visualization', None)

        overcodes_array = self.go_through_children(question, query_parameters_dict)

        response_body['question']['children'] = overcodes_array
        for child in overcodes_array:
            response_body['question']['verbatim_count'] += child['verbatim_count']
            child['overcode'] = True
        for child in overcodes_array:
            child['total'] = child['verbatim_count'] / response_body['question']['verbatim_count']
        return Response(response_body)

    def go_through_children(self, question, query_parameters_dict):
        ''' Represents all children overcodes of the question as dict
            for serializing tp JSON

        Arguments:
        ---------
            question: Question

            query_parameters_dict: dict{String:int}
                query parameters got from request
        Returns:
        --------
            dict of JSON-like data about children of the question
        '''
        variables = []
        if len(query_parameters_dict) != 0:
            variables = models.Variable.objects.filter(**query_parameters_dict)
        unprocessed = [q for q in models.Code.objects.filter(code_book=question.code_book, overcode=True)]
        children = list()

        for code in unprocessed:
            child = self.hierarchy_dfs(question, code, variables)
            if child is not None:
                children.append(child)

        return children

    def hierarchy_dfs(self, question, parent_code, variables, depth=0):
        ''' Builds tree-like hierarchy for children codes and returns
            its JSON-like representation

        Arguments:
        ----------
            question: Question

            parent_code: Code
                code, that is parent for current ones
            variables: Variable
                subset of variables, restricted by request parameters
            depth: int
                level of current code in children hierarchy
        Returns:
        --------
            The code with information about its children and level in hierarchy represented in dict
        '''
        if len(variables) != 0:
            count = models.Verbatim.objects.filter(parent=parent_code,
                                                   question=question,
                                                   variable__in=variables).count()
        else:
            count = models.Verbatim.objects.filter(parent=parent_code,
                                                   question=question,
                                                   ).count()
        code_dict = {
            'id': parent_code.id,
            'title': parent_code.title,
            'code': parent_code.code,
            'text': parent_code.text,
            'code_depth': depth,
            'question_id': question.id,
            'verbatim_count': count
        }

        codes = parent_code.get_children()

        if count == 0 and codes.count() == 0:
            return None

        children_list = list()
        for code in codes:
            child = self.hierarchy_dfs(question, code, variables, depth+1)
            if child is not None:
                children_list.append(child)
                code_dict['verbatim_count'] += child['verbatim_count']

        if len(children_list) == 0 and count == 0:
            return None
        else:
            code_dict['children'] = children_list
        return code_dict
