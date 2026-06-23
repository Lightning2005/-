import io
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader


def convert_images_to_pdf(uploaded_images):
    """
    Принимает список файлов изображений из request.FILES
    Возвращает байтовый поток (BytesIO) с готовым PDF
    """
    pdf_buffer = io.BytesIO()

    # Создаем холст ReportLab
    pdf_canvas = canvas.Canvas(pdf_buffer, pagesize=letter)
    page_width, page_height = letter

    for uploaded_file in uploaded_images:
        # Открываем изображение через Pillow
        img = Image.open(uploaded_file)

        # Конвертируем в RGB, если это PNG с прозрачностью (альфа-каналом),
        # так как базовый PDF не всегда корректно принимает RGBA без подготовки
        if img.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        # Сохраняем оптимизированное изображение во временный байтовый поток
        img_buffer = io.BytesIO()
        img.save(img_buffer, format='JPEG', quality=85)
        img_buffer.seek(0)

        # ОБОРАЧИВАЕМ поток в ImageReader, чтобы ReportLab на Windows не ругался
        img_reader = ImageReader(img_buffer)

        # Рисуем изображение на всю страницу PDF
        # (В будущем можно сделать подгонку под размер картинки)
        pdf_canvas.drawImage(img_reader, 0, 0, width=page_width, height=page_height)
        pdf_canvas.showPage()  # Создаем следующую страницу для следующего фото

    pdf_canvas.save()
    pdf_buffer.seek(0)
    return pdf_buffer