__author__ = 'yarnaid'
from django.conf.urls import url
from views import CloudView
from django.views.decorators.csrf import ensure_csrf_cookie


urlpatterns = [
    url(r'^$', ensure_csrf_cookie(CloudView.as_view())),
]