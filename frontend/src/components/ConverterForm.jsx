// src/components/ConverterForm.jsx
import React, { useState, useRef, useEffect } from 'react';

export default function ConverterForm({ config, slug, preloadedFiles }) {
  const [files, setFiles] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Эффект для подтягивания файлов, прилетевших с главной страницы
  useEffect(() => {
    if (preloadedFiles && preloadedFiles.length > 0) {
      setFiles(preloadedFiles);
    }
  }, [preloadedFiles, slug]); // Перезапускаем, если сменился инструмент или файлы

  // Предотвращаем открытие файлов браузером по умолчанию
  useEffect(() => {
    const handleWindowDragOver = (e) => e.preventDefault();
    const handleWindowDrop = (e) => e.preventDefault();

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('drop', handleWindowDrop);

    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('drop', handleWindowDrop);
    };
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  // Универсальная валидация на основе config.accept и config.maxFiles
  const handleFiles = (newFiles) => {
    setError('');

    const filtered = newFiles.filter(file => {
      const ext = `.${file.name.split('.').pop().toLowerCase()}`;
      return config.accept.toLowerCase().includes(ext);
    });

    if (filtered.length === 0) {
      setError(`Пожалуйста, выберите файлы в формате ${config.sourceName}`);
      return;
    }

    setFiles((prev) => {
      const updatedList = [...prev, ...filtered];
      if (updatedList.length > config.maxFiles) {
        setError(`Превышен лимит! Для этого инструмента можно выбрать не более ${config.maxFiles} файлов.`);
        return prev;
      }
      return updatedList;
    });
  };

  return (
    <>
      {/* Динамический текст заголовков */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
          Конвертация {config.sourceName} в {config.targetName}
        </h1>
        <p className="mt-2 text-slate-500">
          {config.description || `Быстрый и безопасный способ превратить ваши файлы в аккуратный ${config.targetName} документ`}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInput}
        accept={config.accept}
      />

      {/* Интерактивная зона драг-н-дропа */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`w-full max-w-xl aspect-video border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-6 cursor-pointer transition select-none ${
          isDragActive
            ? 'bg-blue-50 border-blue-400 text-blue-800 scale-[1.01]'
            : 'bg-cyan-50/50 border-cyan-300 text-cyan-800 hover:bg-cyan-50 hover:border-cyan-400'
        }`}
      >
        <span className={`text-5xl mb-3 transition-transform duration-200 ${isDragActive ? 'scale-110' : ''}`}>
          {isDragActive ? '📥' : '📁'}
        </span>
        <span className="font-semibold text-base md:text-lg">
          {isDragActive ? 'Сбросьте файлы сюда' : 'Перетащите файлы сюда или нажмите для выбора'}
        </span>
        <span className="text-xs text-slate-400 font-normal mt-2">
          Поддерживаются только файлы с расширением {config.sourceName} (Макс: {config.maxFiles} шт.)
        </span>
      </div>

      {/* Ошибки валидации */}
      {error && (
        <div className="w-full max-w-xl bg-red-50 border-l-4 border-red-500 p-3 rounded-md text-sm text-red-700 font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Статистика файлов */}
      <div className="w-full max-w-xl text-center text-sm text-slate-500 flex justify-between px-2">
        <span>Выбрано файлов: <span className="font-bold text-slate-800">{files.length}</span> из {config.maxFiles}</span>
        {files.length > 0 && (
          <button onClick={() => setFiles([])} className="text-red-500 hover:underline">Очистить список</button>
        )}
      </div>

      {/* Кнопка отправки на бэкенд */}
      {files.length > 0 && (
        <button className="w-full max-w-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
          <span>🚀</span> Конвертировать в {config.targetName}
        </button>
      )}

      <div className="w-full max-w-2xl border-t border-slate-100 pt-6">
        <h3 className="font-semibold text-lg mb-2 text-slate-800">Как это работает:</h3>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
          <li>Перетащите файлы в голубую зону выше или нажмите «Выбрать файлы»</li>
          <li>Настройте порядок картинок при необходимости</li>
          <li>Нажмите кнопку «Конвертировать» и скачайте готовый {config.targetName}</li>
        </ul>
      </div>
    </>
  );
}