from django.conf.urls import url, include
from rest_framework import routers
from data_app import views


router = routers.DefaultRouter()
router.register(r'jobs', views.JobViewSet)
router.register(r'questions', views.QuestionViewSet)
router.register(r'short_questions', views.ShortQuestionViewSet)
router.register(r'variable_codes', views.VariableCodesViewSet)
router.register(r'code_books', views.CodeBookViewSet)
router.register(r'codes', views.CodeViewSet)
router.register(r'verbatims', views.VerbatimViewSet)
router.register(r'variables', views.VariableViewSet)
router.register(r'viz_data', views.VisDataViewSet)

router.register(r'subnet_verbatims', views.SubnetVerbatims)

urlpatterns = (
    url(r'^', include(router.urls)),
    url(r'joint', views.JointVerbatims.as_view()),
    url(r'visualization_data', views.VerbatimsFilteredSet.as_view()),
    url(r'coocurence', views.CoocurrenceView.as_view())
)