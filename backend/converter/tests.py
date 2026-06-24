import io
from django.urls import reverse
from rest_framework.test import APITestCase
from PIL import Image
from .services import convert_images_to_pdf, convert_pdf_to_images

class ImagesToPdfAPITestCase(APITestCase):

    def generate_test_image(self, filename, ext='JPEG', size=(100, 100), color='blue'):
        """Вспомогательный метод для генерации картинки в памяти"""
        file_buf = io.BytesIO()
        image = Image.new('RGB', size, color=color)
        image.save(file_buf, format=ext)
        file_buf.name = filename
        file_buf.seek(0)
        return file_buf

    def test_successful_images_to_pdf_conversion(self):
        """Тест успешной конвертации нескольких изображений в один PDF"""
        # 1. Берем наш именованный URL-адрес
        url = reverse('images_to_pdf')

        # 2. Генерируем две тестовые картинки (JPG и PNG)
        img1 = self.generate_test_image('test1.jpg', ext='JPEG', color='red')
        img2 = self.generate_test_image('test2.png', ext='PNG', color='green')

        # 3. Формируем multipart/form-data тело запроса
        data = {
            'images': [img1, img2]
        }

        # 4. Отправляем POST-запрос на эндпоинт
        response = self.client.post(url, data, format='multipart')

        #print("\n--- ДЕТАЛИ ОШИБКИ БЭКЕНДА: ---", response.data)

        # 5. Проверяем утверждения (Asserts)
        # Ожидаем статус-код 200 OK
        self.assertEqual(response.status_code, 200)

        # Проверяем, что возвращается именно PDF-файл
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertIn('attachment; filename="converted_images.pdf"', response['Content-Disposition'])

        # Проверяем, что бинарный поток ответа не пустой
        pdf_content = b"".join(response.streaming_content)
        self.assertTrue(len(pdf_content) > 0)

        # Сигнатура (первых 4 байта) любого валидного PDF файла должна быть %PDF
        self.assertEqual(pdf_content[:4], b'%PDF')

    def test_conversion_fails_without_images(self):
        """Тест обработки ошибки, если файлы не были переданы"""
        url = reverse('images_to_pdf')

        # Отправляем пустой запрос
        response = self.client.post(url, {}, format='multipart')

        # Ожидаем ошибку 400 Bad Request
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {"error": "Файлы не переданы"})

    def test_successful_pdf_to_images_conversion(self):
        """Тест успешной конвертации PDF обратно в архив с картинками"""
        url = reverse('pdf_to_images')

        # 1. Сначала генерируем валидный PDF в памяти, используя наш старый сервис
        img = self.generate_test_image('source.jpg', ext='JPEG')
        valid_pdf_buffer = convert_images_to_pdf([img])
        valid_pdf_buffer.name = 'test.pdf'

        # 2. Отправляем этот PDF на новый эндпоинт
        data = {'pdf': valid_pdf_buffer}
        response = self.client.post(url, data, format='multipart')

        # 3. Проверяем результат
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'application/zip')
        self.assertIn('filename="converted_pages.zip"', response['Content-Disposition'])

        # Проверяем, что архив не пустой
        zip_content = b"".join(response.streaming_content)
        self.assertTrue(len(zip_content) > 0)