import io
import zipfile
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from pdf2image import convert_from_bytes
from django.conf import settings  # Импортируем настройки проекта


def convert_images_to_pdf(uploaded_images):
    """
    Принимает список файлов изображений из request.FILES.
    Возвращает байтовый поток (BytesIO) с готовым PDF,
    где размер каждой страницы точно соответствует размеру изображения.
    """
    pdf_buffer = io.BytesIO()

    # Создаем canvas без жесткого указания pagesize (зададим динамически ниже)
    pdf_canvas = canvas.Canvas(pdf_buffer)

    for uploaded_file in uploaded_images:
        img = Image.open(uploaded_file)

        # Конвертируем в RGB, если это PNG с прозрачностью
        if img.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        # Получаем реальные размеры изображения в пикселях
        img_width, img_height = img.size

        # Сохраняем оптимизированное изображение во временный байтовый поток
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='JPEG', quality=85)
        img_buffer.seek(0)

        img_reader = ImageReader(img_buffer)

        # Устанавливаем размер текущей страницы PDF под размер картинки
        pdf_canvas.setPageSize((img_width, img_height))

        # Рисуем изображение ровно в границы страницы
        pdf_canvas.drawImage(img_reader, 0, 0, width=img_width, height=img_height)
        pdf_canvas.showPage()  # Переходим к следующей странице

    pdf_canvas.save()
    pdf_buffer.seek(0)
    return pdf_buffer


def convert_pdf_to_images(uploaded_pdf):
    """
    Принимает PDF-файл из request.FILES.
    Возвращает байтовый поток (BytesIO) с ZIP-архивом страниц.
    """
    pdf_bytes = uploaded_pdf.read()

    # Берем путь к poppler из settings.py (на Linux там будет None)
    pages = convert_from_bytes(pdf_bytes, poppler_path=settings.POPPLER_PATH)

    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for index, page in enumerate(pages):
            img_buffer = io.BytesIO()
            page.save(img_buffer, format='JPEG', quality=90)
            img_buffer.seek(0)

            filename = f"page_{index + 1}.jpg"
            zip_file.writestr(filename, img_buffer.read())

    zip_buffer.seek(0)
    return zip_buffer