import json
from django.http import HttpResponse
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.utils.translation import ugettext as _
from django.conf import settings
import os
import helpers
from helpers.views import LoginMixin

# Create your views here.
stub = settings.STUB
sample_name = settings.SAMPLE_NAME
lex_name = settings.LEX_NAME


class CloudView(LoginMixin, TemplateView):
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
                data = {'message': _('error!')}
            if request.POST.get('csv', 'false') != 'true':
                response = HttpResponse(json.dumps(data), content_type='application/json')
            else:
                response = HttpResponse(content_type='text/csv')
        else:
            response = super(CloudView, self).get(request, *args, **kwargs)
        if request.POST.get('csv') == 'true':
                response['Content-Disposition'] = 'attachment; filename="cloud.csv"'
                helpers.json2csv(response, data['nodes'])
        return response


    @staticmethod
    def get_verbatim(code_id):
        path = os.path.join(settings.BASE_DIR, stub, lex_name)
        with open(path, 'r') as f:
            data = json.load(f)
        return data[code_id]
