import React from 'react';
import MainLayout from './components/MainLayout';

export default function App() {
  return (
    <MainLayout>
      {/* Заголовок страницы */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Конвертация изображений в PDF
        </h1>
        <p className="mt-2 text-slate-500">
          Быстрый и безопасный способ превратить ваши файлы в аккуратный PDF документ
        </p>
      </div>

      {/* Временная заглушка зоны загрузки */}
      <div className="w-full max-w-xl aspect-video bg-cyan-100 border-2 border-cyan-300 rounded-2xl flex items-center justify-center text-cyan-800 font-semibold shadow-inner">
        Зона загрузки файлов (Dropzone)
      </div>

      {/* Инструкция */}
      <div className="w-full max-w-2xl border-t border-slate-100 pt-6">
        <h3 className="font-semibold text-lg mb-2">Как это работает:</h3>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
          <li>Перетащите файлы в голубую зону выше или нажмите «Выбрать файлы»</li>
          <li>Настройте порядок картинок при необходимости</li>
          <li>Нажмите кнопку «Конвертировать» и скачайте готовый PDF</li>
        </ul>
      </div>
    </MainLayout>
  );
}