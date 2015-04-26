__author__ = 'yarnaid'
from django.conf.urls import url
from views import WordleView

urlpatterns = (
    url(r'^$', WordleView.as_view()),
)
