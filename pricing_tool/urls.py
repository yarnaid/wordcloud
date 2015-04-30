__author__ = 'yarnaid'
from django.conf.urls import url
from views import PricingView


urlpatterns = (
    url(r'^$', PricingView.as_view(), name='pricing_tool'),
)