__author__ = 'yarnaid'
from django.conf.urls import url
from django.views.decorators.csrf import ensure_csrf_cookie

from views import CloudView


urlpatterns = (
    url(r'^$', ensure_csrf_cookie(CloudView.as_view())),
)