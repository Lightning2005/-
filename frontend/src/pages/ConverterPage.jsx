import React from 'react';
import { useParams } from 'react-router-dom';

export default function ConverterPage() {
  // Получаем параметры из URL (например, source = "jpg", target = "pdf")
  const { source, target } = useParams();

  // Приводим к верхнему регистру для красивого отображения
  const sourceName = source?.toUpperCase();
  const targetName = target?.toUpperCase();

  return (
    <>
      {/* Заголовок страницы */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Конвертация {sourceName} в {targetName}
        </h1>
        <p className="mt-2 text-slate-500">
          Быстрый и безопасный способ превратить файлы {sourceName} в аккуратный {targetName} документ
        </p>
      </div>

      {/* Зона загрузки */}
      <div className="w-full max-w-xl aspect-video bg-cyan-50 border-2 border-dashed border-cyan-300 rounded-2xl flex flex-col items-center justify-center text-cyan-800 font-semibold shadow-inner p-6 cursor-pointer hover:bg-cyan-100/50 transition">
        <span className="text-4xl mb-2">📁</span>
        <span>Перетащите файлы сюда или нажмите для выбора</span>
        <span className="text-xs text-slate-400 font-normal mt-1">Поддерживаются файлы {sourceName}</span>
      </div>

      {/* Инструкция */}
      <div className="w-full border-t border-slate-100 pt-6">
        <h3 className="font-semibold text-lg mb-2 text-slate-800">Как это работает:</h3>
        <ul className="list-disc pl-5 space-y-1 text-slate-600 text-sm">
          <li>Перетащите файлы в зону загрузки или выберите их на устройстве</li>
          <li>Настройте параметры конвертации при необходимости</li>
          <li>Нажмите кнопку «Конвертировать» и сохраните готовый {targetName}</li>
        </ul>
      </div>
    </>
  );
}