import json
import os
from django.shortcuts import render
from django.views.generic import TemplateView
from django.conf import settings
from django.http import HttpResponse
from django.utils.translation import ugettext as _

# Create your views here.


class WordleView(TemplateView):
    template_name = 'wordle/wordle.html'

    def post(self, request, *args, **kwargs):
        if request.is_ajax():
            if request.POST.get('all') == 'true':
                path = os.path.join(settings.BASE_DIR, settings.STUB, settings.SAMPLE_NAME)
                with open(path, 'r') as f:
                    data = json.load(f)
            else:
                data = {'message': _('error!')}
            response = HttpResponse(json.dumps(data), content_type='application/json')
        else:
            response = super(WordleView, self).post(request, *args, **kwargs)
        return response
