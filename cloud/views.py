import json
from django.http import HttpResponse
from django.shortcuts import render
from django.utils import http
from django.views.generic import TemplateView
from django.utils.translation import ugettext as _
from django.conf import settings
import os

# Create your views here.
stub = 'stubs'
sample_name = 'sample.json'
lex_name = 'lex.json'


class CloudView(TemplateView):
    template_name = 'cloud/cloud.html'

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            if request.POST.get('all') == 'true':
                # FIX: temporary data stub
                path = os.path.join(settings.BASE_DIR, stub, sample_name)
                with open(path, 'r') as f:
                    data = json.load(f)
            elif request.POST.get('verbatim') == 'true':
                code_id = request.POST.get('id')
                data = self.get_verbatim(code_id)
            else:
                data = {'message': 'error!'}
            response = HttpResponse(json.dumps(data), content_type='application/json')
        else:
            response = super(CloudView, self).get(request, *args, **kwargs)
        return response


    @staticmethod
    def get_verbatim(code_id):
        path = os.path.join(settings.BASE_DIR, stub, lex_name)
        with open(path, 'r') as f:
            data = json.load(f)
        return data[code_id]
