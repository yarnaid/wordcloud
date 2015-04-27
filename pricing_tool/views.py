from django.shortcuts import render
from django.views.generic import FormView, TemplateView
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.forms.formsets import formset_factory

from forms import HeaderForm, CellFormSet

from helpers.views import CsrfCookieMixin

# Create your views here.

point_price = 0.12
point_time = 7.2
q1_price = 0.95
q2_price = 0.35
q3_price = 0
q4_price = 0.18


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
        points = 0
        print len(cells)
        try:
            for cell in cells:
                print 'cell'
                cell.is_valid()
                print cell.cleaned_data
                if cell.is_valid():
                    if cell.cleaned_data['new_coded_frame']:
                        points += 11.2
                    else:
                        points += 8
                    price = 0
                    time = 0
                    ssize = cell.cleaned_data['sample_size']
                    q1 = cell.cleaned_data['story_questions']
                    q2 = cell.cleaned_data['impressions_number']
                    q3 = cell.cleaned_data['brands_number']
                    q4 = cell.cleaned_data['brands_number']
                    points += (q1*q1_price + q2*q2_price + q4*q4_price) * ssize
        except Exception as e:
            print e
        response = HttpResponse(points)
        return response