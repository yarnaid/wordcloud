import json
from django.views.generic import TemplateView
from django.http import HttpResponse

from forms import HeaderForm, CellFormSet

from helpers.views import CsrfCookieMixin

# Create your views here.

point_price = 0.12
point_time = 7.2 / 60.  # to minutes
new_code_frame_price = [
    11.2,
    4.2,
    1.5,
    1
]
existing_code_frame_price = [
    8,
    3,
    1.5,
    1
]


class PricingView(CsrfCookieMixin, TemplateView):
    template_name = 'pricing_tool/content.html'

    def get_context_data(self, **kwargs):
        context = super(PricingView, self).get_context_data(**kwargs)
        context['form'] = HeaderForm()
        context['cell_form'] = CellFormSet()
        return context

    def post(self, request, *args, **kwargs):
        response = HttpResponse(request.POST)
        header = HeaderForm(request.POST)
        header.is_valid()
        cells = CellFormSet(request.POST)
        total_points = 0
        res = list()
        for cell in cells:
            if cell.is_valid():
                points = 0
                cell_number = cell.prefix.split('-')[-1]
                code_frame_price = []
                if cell.cleaned_data['new_coded_frame']:
                    code_frame_price = new_code_frame_price
                else:
                    code_frame_price = existing_code_frame_price
                price = 0
                time = 0
                ssize = cell.cleaned_data['sample_size']
                q1 = cell.cleaned_data['story_questions']
                q2 = cell.cleaned_data['impressions_number']
                q3 = cell.cleaned_data['one_word_number']
                q4 = cell.cleaned_data['brands_number']
                points += (q1 * code_frame_price[0] +
                           q2 * code_frame_price[1] +
                           q3 * code_frame_price[2] +
                           q4 * code_frame_price[3]) * ssize
                total_points += points
                res.append({
                    'cell_number': cell_number,
                    'cell_points': points,
                    'cell_price': points * point_price,
                    'cell_time': points * point_time
                })
        res.append({
            'cell_number': 'Total',
            'cell_points': total_points,
            'cell_price': total_points * point_price,
            'cell_time': total_points * point_time
        })
        response = HttpResponse(json.dumps(res), content_type='application/json')
        return response