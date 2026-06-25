import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SUPPORTED_TOOLS } from '../config/tools';

export default function MainLayout({ children }) {
  // Стейт для активного дропдауна: 'pdf', 'image' или null
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Рефы для отслеживания клика «мимо элементов»
  const pdfRef = useRef(null);
  const imageRef = useRef(null);

  // Получаем информацию о текущем URL
  const location = useLocation();

  // Массив путей, где НЕ ДОЛЖНО быть рекламы
  const hideAdsRoutes = ['/privacy', '/contacts'];
  // Флаг: показывать ли рекламу на текущей странице
  const showAds = !hideAdsRoutes.includes(location.pathname);

  // Группируем инструменты из конфигурации на основе их категорий
  const toolsArray = Object.entries(SUPPORTED_TOOLS).map(([slug, data]) => ({ slug, ...data }));
  const pdfTools = toolsArray.filter(t => t.category === 'pdf');
  const imageTools = toolsArray.filter(t => t.category === 'image');

  // Переключатель стейта конкретного дропдауна
  const toggleDropdown = (menuType) => {
    setActiveDropdown((prev) => (prev === menuType ? null : menuType));
  };

  // Закрываем дропдауны при клике в любое другое место экрана
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (pdfRef.current && !pdfRef.current.contains(event.target)) &&
        (imageRef.current && !imageRef.current.contains(event.target))
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] text-slate-900">

      {/* ШАПКА */}
      <header className="w-full bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md shrink-0 z-50">

        {/* Логотип */}
        <div className="font-bold text-xl flex items-center gap-2 cursor-pointer">
          <Link to="/" onClick={() => setActiveDropdown(null)}>✉️ Конверт</Link>
        </div>

        {/* ДИНАМИЧЕСКАЯ НАВИГАЦИЯ (ДЕCКТОП) */}
        <nav className="hidden md:flex gap-6 font-medium relative">

          {/* Дропдаун: Инструменты PDF */}
          <div className="relative" ref={pdfRef}>
            <button
              onClick={() => toggleDropdown('pdf')}
              className={`hover:text-blue-200 flex items-center gap-1 transition focus:outline-none ${activeDropdown === 'pdf' ? 'text-blue-200' : ''}`}
            >
              Инструменты PDF
              <span className={`text-xs transition-transform duration-200 inline-block ${activeDropdown === 'pdf' ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {activeDropdown === 'pdf' && (
              <div className="absolute left-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn text-slate-800">
                {pdfTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    to={`/tool/${tool.slug}`}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 hover:text-blue-600 transition font-normal"
                  >
                    <span>{tool.icon}</span>
                    <span>{tool.sourceName} в {tool.targetName}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Дропдаун: Конвертер изображений */}
          <div className="relative" ref={imageRef}>
            <button
              onClick={() => toggleDropdown('image')}
              className={`hover:text-blue-200 flex items-center gap-1 transition focus:outline-none ${activeDropdown === 'image' ? 'text-blue-200' : ''}`}
            >
              Конвертер картинок
              <span className={`text-xs transition-transform duration-200 inline-block ${activeDropdown === 'image' ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {activeDropdown === 'image' && (
              <div className="absolute left-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn text-slate-800">
                {imageTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    to={`/tool/${tool.slug}`}
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50 hover:text-blue-600 transition font-normal"
                  >
                    <span>{tool.icon}</span>
                    <span>{tool.sourceName} в {tool.targetName}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </nav>

        {/* Системные переключатели */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-blue-700 rounded transition text-sm">RU</button>
          <button className="p-2 hover:bg-blue-700 rounded transition">🌙</button>
        </div>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТЕР */}
      <div className="flex-1 w-full flex p-6 gap-6 justify-between items-start relative max-w-[1600px] mx-auto py-12">

        {/* ЛЕВАЯ РЕКЛАМА */}
        {showAds && (
          <aside className="hidden xl:flex w-[200px] h-[600px] bg-white border border-slate-200 rounded-xl p-4 items-center justify-center text-center text-slate-400 shrink-0 sticky top-6 shadow-sm z-0">
            Реклама <br /> (Небоскреб)
          </aside>
          )}

        {/* ЦЕНТРАЛЬНАЯ РАБОЧАЯ ЗОНА */}
        <div className="flex-1 flex flex-col items-center gap-8 max-w-[1000px] mx-auto w-full">

          {/* Рабочий стол инструмента */}
          <main className="w-full flex flex-col items-center justify-between gap-8 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200/60 min-h-[550px]">
            {children}
          </main>

          {/* НИЖНИЙ БЛОК РЕКЛАМЫ */}
          {showAds && (
            <div className="w-full max-w-[1000px] h-[175px] bg-white border border-slate-200 rounded-xl flex items-center justify-center text-center text-slate-400 shrink-0 shadow-sm">
              Нижний рекламный block (1000х175)
            </div>
          )}

        </div>

        {/* ПРАВАЯ РЕКЛАМА */}
        {showAds && (
          <aside className="hidden xl:flex w-[200px] h-[600px] bg-white border border-slate-200 rounded-xl p-4 items-center justify-center text-center text-slate-400 shrink-0 sticky top-6 shadow-sm z-0">
            Реклама <br /> (Небоскреб)
          </aside>
        )}
      </div>

      {/* ПОДВАЛ */}
      <footer className="w-full text-center text-xs text-slate-400 py-6 mt-auto border-t border-slate-200/50 bg-white/50 backdrop-blur-sm flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 shrink-0">
        <div>
          &copy; {new Date().getFullYear()} Конверт. Все права защищены.
        </div>
        <div className="flex gap-4 font-medium text-slate-500">
          <Link to="/privacy" className="hover:text-blue-600 transition">Политика конфиденциальности</Link>
          <span className="text-slate-200">|</span>
          <Link to="/contacts" className="hover:text-blue-600 transition">Контакты</Link>
        </div>
      </footer>
    </div>
  );
}