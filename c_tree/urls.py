__author__ = 'yarnaid'
from django.conf.urls import url
from django.views.decorators.csrf import ensure_csrf_cookie

from views import TreeView


urlpatterns = (
    url(r'^$', ensure_csrf_cookie(TreeView.as_view())),
)