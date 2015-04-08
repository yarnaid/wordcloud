__author__ = 'yarnaid'
from django.conf.urls import url
from views import CloudView

urlpatterns = [
    url(r'^$', CloudView.as_view()),
]