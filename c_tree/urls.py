__author__ = 'yarnaid'
from django.conf.urls import url
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required

from views import TreeView


urlpatterns = (
    url(r'^$', login_required(ensure_csrf_cookie(TreeView.as_view()))),
)