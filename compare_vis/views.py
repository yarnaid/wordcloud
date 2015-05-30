from django.shortcuts import render
from django.views.generic import TemplateView

# Create your views here.


class CompareView(TemplateView):
    """
    Description
    -----------
    Comparing view for multi window page

    """

    template_name = 'compare_vis/content.html'
