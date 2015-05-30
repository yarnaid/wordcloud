from django.conf.urls import url
from compare_vis import views


urlpatterns = (
    url(r'^$', views.CompareView.as_view(), name='compare'),
    )
