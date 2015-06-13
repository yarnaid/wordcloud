from django.shortcuts import render
from django.views.generic import TemplateView
from helpers import views

# Create your views here.


class CompareView(views.LoginMixin, TemplateView):
    """
    Description
    -----------
    Comparing view for multi window page

    """

    template_name = 'compare_vis/content.html'
