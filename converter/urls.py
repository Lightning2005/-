from django.urls import path
from .views import ImagesToPdfView

urlpatterns = [
    path('api/images-to-pdf/', ImagesToPdfView.as_view(), name='images_to_pdf'),
]