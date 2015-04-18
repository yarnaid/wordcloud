__author__ = 'yarnaid'

from django.conf.urls import url
from views import WordleView
from django.views.decorators.csrf import ensure_csrf_cookie

urlpatterns = (
    url(r'^$', ensure_csrf_cookie(WordleView.as_view())),
)
