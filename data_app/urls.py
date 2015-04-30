__author__ = 'yarnaid'

from django.conf.urls import url, include
from rest_framework import routers
from data_app import views

router = routers.DefaultRouter()
router.register(r'jobs', views.JobViewSet)
router.register(r'questions', views.QuestionViewSet)
router.register(r'code_books', views.CodeBookViewSet)
router.register(r'codes', views.CodeViewSet)
router.register(r'verbatims', views.VerbatimViewSet)
router.register(r'variables', views.VariableViewSet)


urlpatterns = (
    url(r'^', include(router.urls)),
)