import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  // Список инструментов для вывода плиткой
  const tools = [
    { name: 'JPG в PDF', path: '/jpg-to-pdf', icon: '🖼️' },
    { name: 'PDF в JPG', path: '/pdf-to-jpg', icon: '📄' },
    { name: 'PNG в WebP (Скоро)', path: '#', icon: '⚡', disabled: true },
  ];

  return (
    <>
      {/* Заголовок главной страницы */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
          Бесплатный онлайн конвертер файлов
        </h1>
        <p className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto">
          Конвертируйте изображения, документы и медиафайлы в один клик. Без регистрации и водяных знаков.
        </p>
      </div>

      {/* Общая большая кнопка выбора на главной */}
      <div className="w-full max-w-xl bg-blue-50/50 border-2 border-blue-200 rounded-2xl py-12 px-6 flex flex-col items-center justify-center text-center shadow-sm">
        <span className="text-5xl mb-4">🚀</span>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5">
          Выбрать файлы для конвертации
        </button>
        <span className="text-xs text-slate-400 mt-3">Или выберите нужный инструмент из списка ниже</span>
      </div>

      {/* Сетка доступных инструментов (Аналог меню FreeConvert) */}
      <div className="w-full border-t border-slate-100 pt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center md:text-left">Доступные инструменты</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tools.map((tool, index) => (
            <Link
              key={index}
              to={tool.path}
              className={`flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-blue-200 transition ${
                tool.disabled ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <span className="text-2xl bg-white p-2 rounded-lg shadow-sm border border-slate-100">{tool.icon}</span>
              <span className="font-semibold text-slate-700 text-sm md:text-base">{tool.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}