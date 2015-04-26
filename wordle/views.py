import json
import os
from django.shortcuts import render
from django.views.generic import TemplateView
from django.conf import settings
from django.http import HttpResponse
from django.utils.translation import ugettext as _
import helpers
from helpers.views import LoginMixin, CsrfCookieMixin
# Create your views here.


class WordleView(LoginMixin, CsrfCookieMixin, TemplateView):
    template_name = 'wordle/wordle.html'

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            if request.POST.get('all') == 'true':
                path = os.path.join(settings.BASE_DIR, settings.STUB, settings.SAMPLE_NAME)
                with open(path, 'r') as f:
                    data = json.load(f)
            else:
                data = {'message': _('error!')}
            if request.POST.get('csv', 'false') != 'true':
                response = HttpResponse(json.dumps(data), content_type='application/json')
            else:
                response = HttpResponse(content_type='text/csv')
        else:
            response = super(WordleView, self).post(request, *args, **kwargs)
        if request.POST.get('csv') == 'true':
                response['Content-Disposition'] = 'attachment; filename="cloud.csv"'
                helpers.json2csv(response, data['nodes'])
        return response
