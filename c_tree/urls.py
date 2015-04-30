__author__ = 'yarnaid'
from django.conf.urls import url

from views import TreeView


urlpatterns = (
    url(r'^$', TreeView.as_view(), name='tree'),
)