import io
import zipfile
from PIL import Image, ImageOps
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from pdf2image import convert_from_bytes
from django.conf import settings


# 1. Твоя существующая функция для работы с PDF
def convert_images_to_pdf(uploaded_images):
    pdf_buffer = io.BytesIO()
    page_width, page_height = A4
    pdf_canvas = canvas.Canvas(pdf_buffer, pagesize=A4)

    for uploaded_file in uploaded_images:
        img = Image.open(uploaded_file)
        img = ImageOps.exif_transpose(img)

        if img.mode in ('RGBA', 'LA'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])
            img = background
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        margin = 7
        usable_w = page_width - (2 * margin)
        usable_h = page_height - (2 * margin)

        img_w, img_h = img.size
        ratio = min(usable_w / img_w, usable_h / img_h)
        new_w = img_w * ratio
        new_h = img_h * ratio

        x = (page_width - new_w) / 2
        y = (page_height - new_h) / 2

        img_reader = ImageReader(img)
        pdf_canvas.drawImage(img_reader, x, y, width=new_w, height=new_h)
        pdf_canvas.showPage()

    pdf_canvas.save()
    pdf_buffer.seek(0)
    return pdf_buffer


# 2. Функция для PDF -> Images (JPG или PNG)
def convert_pdf_to_images(uploaded_pdf, target_format='jpg'):
    target_format = target_format.lower()

    if target_format in ('jpg', 'jpeg'):
        pil_format = 'JPEG'
        file_ext = 'jpg'
    elif target_format == 'png':
        pil_format = 'PNG'
        file_ext = 'png'
    else:
        raise ValueError(f"Формат {target_format} не поддерживается для PDF.")

    pdf_bytes = uploaded_pdf.read()
    pages = convert_from_bytes(pdf_bytes, poppler_path=settings.POPPLER_PATH)
    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for index, page in enumerate(pages):
            img_buffer = io.BytesIO()
            if pil_format == 'JPEG':
                page.save(img_buffer, format='JPEG', quality=90)
            else:
                page.save(img_buffer, format='PNG')
            img_buffer.seek(0)
            zip_file.writestr(f"page_{index + 1}.{file_ext}", img_buffer.read())

    zip_buffer.seek(0)
    return zip_buffer


# 3. Универсальная функция (для обычных конвертаций)
def convert_image(uploaded_file, target_format):
    target_format = target_format.lower()
    # 1. Валидация поддерживаемых форматов
    supported_formats = {
        'jpg': 'JPEG',
        'jpeg': 'JPEG',
        'png': 'PNG',
        'webp': 'WEBP',
        'tiff': 'TIFF',
        'ico': 'ICO',
    }

    if target_format not in supported_formats:
        raise ValueError(f"Формат {target_format} не поддерживается.")

    img = Image.open(uploaded_file)
    img = ImageOps.exif_transpose(img)

    # 2. Обработка прозрачности (для JPEG)
    if target_format in ['jpg', 'jpeg'] and img.mode in ('RGBA', 'LA'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background
    elif img.mode != 'RGB' and target_format in ['jpg', 'jpeg']:
        img = img.convert('RGB')

    output_buffer = io.BytesIO()
    # 3. Сохраняем с использованием маппинга
    img.save(output_buffer, format=supported_formats[target_format])
    output_buffer.seek(0)

    return output_buffer