__author__ = 'yarnaid'
from django.conf.urls import url
from views import PricingView, PricingRoundView


urlpatterns = (
    url(r'^$', PricingView.as_view(), name='pricing_tool'),
    url(r'^/round/$', PricingRoundView.as_view(), name='pricing_round_tool'),
)