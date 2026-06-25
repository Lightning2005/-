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

  // Стейт для интерактивного FAQ аккордеона (хранит индекс открытого вопроса)
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Ограничения для безопасности сервера
  const MAX_TOTAL_SIZE_MB = 50;

  // Данные для блока FAQ
  const faqData = [
    {
      q: 'Безопасно ли загружать мои файлы на ваш сайт?',
      a: 'Абсолютно безопасно. Все загруженные файлы обрабатываются в изолированном облачном хранилище и автоматически удаляются с наших серверов ровно через 1 час после завершения конвертации. Мы не просматриваем, не копируем и не передаем ваши данные третьим лицам.'
    },
    {
      q: 'Как сконвертировать несколько картинок в один PDF-документ?',
      a: 'Очень просто! Перейдите в инструмент «Картинки в PDF» через верхнее меню, перетащите в зону загрузки сразу несколько файлов (до 10 штук за раз) и нажмите кнопку «Конвертировать». Сервис автоматически соберет их в один аккуратный многостраничный PDF-файл.'
    },
    {
      q: 'Портится ли качество изображений при конвертации?',
      a: 'Нет. Наш сервис использует современные алгоритмы обработки, которые сохраняют исходное разрешение, четкость и цветовую гамму ваших изображений. При конвертации в форматы без потери качества (например, из PNG в PDF) ваши файлы останутся в оригинальном виде.'
    },
    {
      q: 'Есть ли ограничения на размер или количество файлов?',
      a: 'На текущем этапе вы можете бесплатно загружать до 10 файлов в рамках одной сессии конвертации. Ограничение по размеру одного файла составляет 50 МБ, чего более чем достаточно для любых высококачественных фотографий и стандартных документов.'
    },
    {
      q: 'Нужно ли платить за использование сервиса?',
      a: 'Нет, наш конвертер полностью бесплатен. Вам не нужно оформлять подписку, регистрироваться или вводить данные карт. Все инструменты доступны в полном объеме без каких-либо скрытых платежей или водяных знаков на готовых документах.'
    }
  ];

  const getFileExtension = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    return ext === 'jpeg' ? 'jpg' : ext;
  };

  const getAvailableTargets = (sourceExt) => {
    return Object.values(SUPPORTED_TOOLS)
      .filter((tool) => tool.source === sourceExt)
      .map((tool) => ({ ext: tool.target, name: tool.targetName }));
  };

  const handleFilesReceived = (filesList) => {
    setError('');
    const filesArray = Array.from(filesList);
    if (filesArray.length === 0) return;

    const firstExt = getFileExtension(filesArray[0].name);
    const availableTargets = getAvailableTargets(firstExt);

    if (availableTargets.length === 0) {
      setError(`Формат .${firstExt} пока не поддерживается нашим конвертером.`);
      return;
    }

    const isSameType = filesArray.every((file) => getFileExtension(file.name) === firstExt);
    if (!isSameType) {
      setError('Для массовой конвертации выберите файлы одного формата (например, только JPG или только PDF).');
      return;
    }

    const sampleToolKey = Object.keys(SUPPORTED_TOOLS).find(
      (key) => SUPPORTED_TOOLS[key].source === firstExt
    );
    const maxFilesLimit = SUPPORTED_TOOLS[sampleToolKey]?.maxFiles || 10;

    if (filesArray.length > maxFilesLimit) {
      setError(`Превышен лимит! Для этого формата можно загрузить не более ${maxFilesLimit} файлов одновременно.`);
      return;
    }

    const totalSizeMb = filesArray.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024);
    if (totalSizeMb > MAX_TOTAL_SIZE_MB) {
      setError(`Общий вес файлов превышает ${MAX_TOTAL_SIZE_MB} МБ. Пожалуйста, сожмите файлы или загружайте их частями.`);
      return;
    }

    setSelectedFiles(filesArray);
    setDetectedSource(firstExt);
    setTargetFormat(availableTargets[0].ext);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) handleFilesReceived(e.dataTransfer.files);
  };

  const handleFileChange = (e) => {
    if (e.target.files) handleFilesReceived(e.target.files);
  };

  const handleProceed = () => {
    if (!detectedSource || !targetFormat || selectedFiles.length === 0) return;
    const toolSlug = `${detectedSource}-to-${targetFormat}`;
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

  const toggleFaq = (index) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Hero-секция */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4">
          Умный конвертер файлов <span className="text-blue-600">«Конверт»</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Быстрая и безопасная конвертация изображений и PDF документов онлайн. Без регистрации и водяных знаков.
        </p>
      </div>

      {/* Зона загрузки / Панель управления файлами */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 mb-16">
        {selectedFiles.length === 0 ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-50/50 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📂</div>
            <p className="text-xl font-medium text-slate-700 mb-1">
              Перетащите файлы сюда или <span className="text-blue-600 font-semibold">выберите на компьютере</span>
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Макс. размер: {MAX_TOTAL_SIZE_MB} МБ суммарно. Поддерживаются JPG, PNG, WebP, TIFF, PDF
            </p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-md mb-2">
                  Успешно добавлено: {selectedFiles.length} файл(ов)
                </span>
                <h3 className="text-base font-medium text-slate-800 truncate max-w-md">
                  {selectedFiles.length === 1 ? selectedFiles[0].name : `${selectedFiles[0].name} и ещё ${selectedFiles.length - 1}...`}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Исходный формат: <span className="font-bold uppercase text-slate-600">{detectedSource}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600">Конвертировать в:</span>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {getAvailableTargets(detectedSource).map((target) => (
                    <option key={target.ext} value={target.ext}>
                      {target.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                  title="Отмена"
                >
                  ✕
                </button>
                <button
                  onClick={handleProceed}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-2"
                >
                  Далее <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <div className="flex">
              <span className="text-red-500 mr-2">⚠️</span>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* БЛОК СЕО 1: НАШИ ПРЕИМУЩЕСТВА */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-3xl mb-3">🛡️</div>
          <h3 className="font-bold text-slate-800 mb-2">Надежная защита</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Файлы защищены сквозным шифрованием и полностью удаляются с серверов через 60 минут. Никаких утечек.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-3xl mb-3">💎</div>
          <h3 className="font-bold text-slate-800 mb-2">Максимальное качество</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Продвинутые библиотеки обработки сохраняют исходное разрешение, сочные цвета и четкость графики.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
          <div className="text-3xl mb-3">⚡</div>
          <h3 className="font-bold text-slate-800 mb-2">100% Бесплатно</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Конвертируйте документы без водяных знаков, скрытых платежей, подписок и обязательной регистрации.
          </p>
        </div>
      </div>

      {/* БЛОК СЕО 2: ИНТЕРАКТИВНЫЙ FAQ АККОРДЕОН */}
      <div className="border-t border-slate-200/60 pt-10">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-8">
          Часто задаваемые вопросы (FAQ)
        </h2>

        <div className="space-y-3">
          {faqData.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200/70 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-slate-800 hover:bg-slate-50/80 transition-colors focus:outline-none"
                >
                  <span className="text-sm md:text-base">{item.q}</span>
                  <span className={`text-slate-400 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* Плавное раскрытие ответа */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-48 border-t border-slate-100 bg-slate-50/40' : 'max-h-0'
                  }`}
                >
                  <p className="p-5 text-sm text-slate-600 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}