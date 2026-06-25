from django.urls import path
from .views import ImagesToPdfView, PdfToImagesView, GenericConvertView

urlpatterns = [
    path('api/images-to-pdf/', ImagesToPdfView.as_view(), name='images_to_pdf'),
    path('api/pdf-to-images/', PdfToImagesView.as_view(), name='pdf_to_images'),
    path('api/convert/', GenericConvertView.as_view(), name='generic_convert'),
]