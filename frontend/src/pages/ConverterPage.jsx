import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SUPPORTED_TOOLS } from '../config/tools';
import ConverterForm from '../components/ConverterForm'; // Создадим на следующем шаге

export default function ConverterPage() {
  const { slug } = useParams();
  const toolConfig = SUPPORTED_TOOLS[slug];

  // Если пользователь ввёл некорректный URL (нет такого инструмента в конфиге)
  if (!toolConfig) {
    return (
      <div className="text-center py-12 flex flex-col items-center gap-4">
        <span className="text-6xl">🔍</span>
        <h1 className="text-2xl font-bold text-slate-900">Инструмент не найден</h1>
        <p className="text-slate-500 max-w-md">
          К сожалению, запрашиваемый конвертер не существует или находится в разработке.
        </p>
        <Link to="/" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
          На главную
        </Link>
      </div>
    );
  }

  // Если всё ок — рендерим универсальную форму и передаем ей настройки
  return <ConverterForm config={toolConfig} slug={slug} />;
}