from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from django.http import FileResponse
from .services import convert_images_to_pdf, convert_pdf_to_images


class ImagesToPdfView(APIView):
    # Указываем парсер для работы с загружаемыми файлами (form-data)
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        # Получаем список файлов из запроса (ключ 'images')
        uploaded_images = request.FILES.getlist('images')

        if not uploaded_images:
            return Response({"error": "Файлы не переданы"}, status=400)

        try:
            # Вызываем нашу функцию конвертации
            pdf_file = convert_images_to_pdf(uploaded_images)

            # Возвращаем файл пользователю для скачивания
            return FileResponse(
                pdf_file,
                as_attachment=True,
                filename="converted_images.pdf",
                content_type='application/pdf'
            )
        except Exception as e:
            return Response({"error": f"Ошибка конвертации: {str(e)}"}, status=500)

class PdfToImagesView(APIView):
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):
        # Получаем один PDF файл (ключ 'pdf')
        uploaded_pdf = request.FILES.get('pdf')

        if not uploaded_pdf:
            return Response({"error": "Файл PDF не передан"}, status=400)

        try:
            # Вызываем функцию конвертации
            zip_file = convert_pdf_to_images(uploaded_pdf)

            # Возвращаем ZIP-архив пользователю
            return FileResponse(
                zip_file,
                as_attachment=True,
                filename="converted_pages.zip",
                content_type='application/zip'
            )
        except Exception as e:
            return Response({"error": f"Ошибка конвертации PDF: {str(e)}"}, status=500)