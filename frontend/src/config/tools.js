// src/config/tools.js
export const SUPPORTED_TOOLS = {
  'jpg-to-pdf': {
    source: 'jpg',
    target: 'pdf',
    sourceName: 'JPG',
    targetName: 'PDF',
    accept: '.jpg,.jpeg',
    maxFiles: 20,
    description: 'Превратите ваши изображения JPG в аккуратный PDF документ.',
  },
  'pdf-to-jpg': {
    source: 'pdf',
    target: 'jpg',
    sourceName: 'PDF',
    targetName: 'JPG',
    accept: '.pdf',
    maxFiles: 10,
    description: 'Быстрое извлечение всех изображений из PDF файла.',
  },
  'png-to-webp': {
    source: 'png',
    target: 'webp',
    sourceName: 'PNG',
    targetName: 'WebP',
    accept: '.png',
    maxFiles: 50,
    description: 'Оптимизируйте ваши PNG изображения в современный формат WebP.',
  }
};