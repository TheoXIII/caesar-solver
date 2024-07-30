from django.urls import path

from . import views

urlpatterns = [
    path("", views.get_vectors, name="get_vectors"),
]
