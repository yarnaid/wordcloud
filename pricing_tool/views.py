from django.shortcuts import render
from django.views.generic import FormView, TemplateView
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.forms.formsets import formset_factory

from forms import HeaderForm, CellFormSet

from helpers.views import CsrfCookieMixin

# Create your views here.


class PricingView(CsrfCookieMixin, TemplateView):
    template_name = 'pricing_tool/content.html'

    def get_context_data(self, **kwargs):
        context = super(PricingView, self).get_context_data(**kwargs)
        context['form'] = HeaderForm()
        context['cell_form'] = CellFormSet()
        return context
