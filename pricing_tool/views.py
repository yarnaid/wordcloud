from django.shortcuts import render
from django.views.generic import TemplateView, FormView
from django.http import HttpResponse

from forms import HeaderForm

from helpers.views import CsrfCookieMixin

# Create your views here.


class PricingView(CsrfCookieMixin, FormView):
    template_name = 'pricing_tool/content.html'
    form_class = HeaderForm