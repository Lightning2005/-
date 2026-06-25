import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SUPPORTED_TOOLS } from '../config/tools';

export default function HomePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Состояния для загруженных файлов и валидации
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [detectedSource, setDetectedSource] = useState(null);
  const [targetFormat, setTargetFormat] = useState('');
  const [error, setError] = useState('');

  // Ограничения для безопасности сервера
  const MAX_TOTAL_SIZE_MB = 50;

  // 1. Извлечение расширения файла
  const getFileExtension = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    return ext === 'jpeg' ? 'jpg' : ext;
  };

  // 2. Поиск доступных целевых форматов на основе tools.js
  const getAvailableTargets = (sourceExt) => {
    return Object.values(SUPPORTED_TOOLS)
      .filter((tool) => tool.source === sourceExt)
      .map((tool) => ({ ext: tool.target, name: tool.targetName }));
  };

  // 3. Валидация и обработка массива файлов
  const handleFilesReceived = (filesList) => {
    setError('');
    const filesArray = Array.from(filesList);
    if (filesArray.length === 0) return;

    // Проверяем формат первого файла для определения исходного типа
    const firstExt = getFileExtension(filesArray[0].name);
    const availableTargets = getAvailableTargets(firstExt);

    if (availableTargets.length === 0) {
      setError(`Формат .${firstExt} пока не поддерживается нашим конвертером.`);
      return;
    }

    // Проверяем, чтобы все загруженные файлы были одного и того же формата
    const isSameType = filesArray.every((file) => getFileExtension(file.name) === firstExt);
    if (!isSameType) {
      setError('Для массовой конвертации выберите файлы одного формата (например, только JPG или только PDF).');
      return;
    }

    // Находим лимит на количество файлов для данного формата в tools.js
    const sampleToolKey = Object.keys(SUPPORTED_TOOLS).find(
      (key) => SUPPORTED_TOOLS[key].source === firstExt
    );
    const maxFilesLimit = SUPPORTED_TOOLS[sampleToolKey]?.maxFiles || 10;

    if (filesArray.length > maxFilesLimit) {
      setError(`Превышен лимит! Для этого формата можно загрузить не более ${maxFilesLimit} файлов одновременно.`);
      return;
    }

    // Проверка суммарного веса файлов в мегабайтах
    const totalSizeMb = filesArray.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024);
    if (totalSizeMb > MAX_TOTAL_SIZE_MB) {
      setError(`Общий вес файлов превышает ${MAX_TOTAL_SIZE_MB} МБ. Пожалуйста, сожмите файлы или загружайте их частями.`);
      return;
    }

    // Если всё ок — фиксируем стейт
    setSelectedFiles(filesArray);
    setDetectedSource(firstExt);
    // Автоматически предвыбираем первый доступный формат из списка
    setTargetFormat(availableTargets[0].ext);
  };

  // Обработчики событий загрузки
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) handleFilesReceived(e.dataTransfer.files);
  };

  const handleFileChange = (e) => {
    if (e.target.files) handleFilesReceived(e.target.files);
  };

  // 4. Перенаправление на страницу конкретного инструмента с передачей файлов
  const handleProceed = () => {
    if (!detectedSource || !targetFormat || selectedFiles.length === 0) return;

    const toolSlug = `${detectedSource}-to-${targetFormat}`;

    // Переходим на страницу инструмента и передаем файлы через Router State
    navigate(`/tool/${toolSlug}`, {
      state: { preloadedFiles: selectedFiles }
    });
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setDetectedSource(null);
    setTargetFormat('');
    setError('');
  };

  // Группировка инструментов из tools.js для вывода плитки на главной
  const toolsArray = Object.entries(SUPPORTED_TOOLS).map(([slug, data]) => ({ slug, ...data }));
  const imageTools = toolsArray.filter(t => t.category === 'image');
  const pdfTools = toolsArray.filter(t => t.category === 'pdf');

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero-секция */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
          Умный конвертер файлов <span className="text-indigo-600">«Конверт»</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Быстрая и безопасная конвертация изображений и PDF документов онлайн. Без регистрации и водяных знаков.
        </p>
      </div>

      {/* Зона загрузки / Панель управления файлами */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-16">
        {selectedFiles.length === 0 ? (
          // Интерактивная Drop-зона
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-indigo-500 transition-colors bg-gray-50 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📂</div>
            <p className="text-xl font-medium text-gray-700 mb-1">
              Перетащите файлы сюда или <span className="text-indigo-600 font-semibold">выберите на компьютере</span>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Макс. размер: {MAX_TOTAL_SIZE_MB} МБ суммарно. Поддерживаются JPG, PNG, WebP, TIFF, PDF
            </p>
          </div>
        ) : (
          // Вариант А: Окошко настройки формата (как FreeConvert, но аккуратнее)
          <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-md mb-2">
                  Успешно добавлено: {selectedFiles.length} файл(ов)
                </span>
                <h3 className="text-base font-medium text-gray-800 truncate max-w-md">
                  {selectedFiles.length === 1 ? selectedFiles[0].name : `${selectedFiles[0].name} и ещё ${selectedFiles.length - 1}...`}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Исходный формат: <span className="font-bold uppercase text-gray-600">{detectedSource}</span>
                </p>
              </div>

              {/* Умный Дропдаун выбора формата */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Конвертировать в:</span>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {getAvailableTargets(detectedSource).map((target) => (
                    <option key={target.ext} value={target.ext}>
                      {target.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Кнопки управления */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Отмена"
                >
                  ✕
                </button>
                <button
                  onClick={handleProceed}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Далее
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Вывод ошибок валидации */}
        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <span className="text-red-500 mr-2">⚠️</span>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Сетка инструментов для SEO и быстрой навигации */}
      <div className="space-y-12">
        {/* Блок картинок */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🖼️ Конвертер изображений
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {imageTools.map((tool) => (
              <div
                key={tool.slug}
                onClick={() => navigate(`/tool/${tool.slug}`)}
                className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer bg-white hover:border-indigo-200 group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">{tool.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-indigo-600">
                  {tool.sourceName} в {tool.targetName}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Блок PDF */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            📄 Инструменты PDF и документы
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pdfTools.map((tool) => (
              <div
                key={tool.slug}
                onClick={() => navigate(`/tool/${tool.slug}`)}
                className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer bg-white hover:border-indigo-200 group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform inline-block">{tool.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-indigo-600">
                  {tool.sourceName} в {tool.targetName}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}