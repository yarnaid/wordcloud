import json
import os
from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView
from django.utils.translation import gettext as _

from django.conf import settings

# Create your views here.
import helpers


class TreeView(TemplateView):
    template_name = 'c_tree/content.html'

    def post(self, request, *args, **kwargs):
        response = HttpResponse()
        if request.is_ajax():
            if request.POST.get('all') == 'true':
                path = os.path.join(settings.BASE_DIR, settings.STUB, settings.SAMPLE_NAME)
                with open(path) as f:
                    data = json.load(f)
            elif request.POST.get('verbatim') == 'true':
                code_id = request.POST.get('id')
                data = self.get_verbatim(code_id)
            else:
                data = {'message': _('error')}
            if request.POST.get('csv', 'false') != 'true':
                response = HttpResponse(json.dumps(data), content_type='application/json')
            else:
                response['content_type'] = 'text/csv'
        if request.POST.get('csv') == 'true':
            response['Content-Disposition'] = 'attachment; filename="tree.csv"'
            helpers.json2csv(response, data['nodes'])
        return response

    @staticmethod
    def get_verbatim(code_id):
        path = os.path.join(settings.BASE_DIR, settings.STUB, settings.LEX_NAME)
        with open(path, 'r') as f:
            data = json.load(f)
        return data[code_id]
