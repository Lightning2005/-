import React from 'react';
import { Link } from 'react-router-dom';

export default function MainLayout({ children }) {
  return (
    // Изменили h-screen на min-h-screen и добавили плавный радиальный градиент на фон
    <div className="min-h-screen flex flex-col bg-slate-50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] text-slate-900">
      {/* ШАПКА */}
      <header className="w-full bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md shrink-0 z-10">
        <div className="font-bold text-xl flex items-center gap-2 cursor-pointer">
          <span>✉️</span>
          <span>Конверт</span>
        </div>
        <nav className="hidden md:flex gap-6 font-medium">
          <a href="#" className="hover:text-blue-200 transition">PDF в Картинки</a>
          <a href="#" className="hover:text-blue-200 transition">Картинки в PDF</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-blue-700 rounded transition text-sm">RU</button>
          <button className="p-2 hover:bg-blue-700 rounded transition">🌙</button>
        </div>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТЕР */}
      {/* Заменили items-center на items-start + добавили хороший отступ сверху py-12 */}
      <div className="flex-1 w-full flex p-6 gap-6 justify-between items-start relative max-w-[1600px] mx-auto py-12">

        {/* ЛЕВАЯ РЕКЛАМА — теперь она sticky, не улетает при скролле и сидит аккуратно */}
        <aside className="hidden xl:flex w-[200px] h-[600px] bg-white border border-slate-200 rounded-xl p-4 items-center justify-center text-center text-slate-400 shrink-0 sticky top-6 shadow-sm">
          Реклама <br /> (Небоскреб)
        </aside>

        {/* ЦЕНТРАЛЬНАЯ РАБОЧАЯ ЗОНА */}
        {/* Увеличили max-w до 1000px, чтобы блок выглядел солиднее на широких экранах */}
        <div className="flex-1 flex flex-col items-center gap-8 max-w-[1000px] mx-auto w-full">

          {/* Рабочий стол инструмента */}
          <main className="w-full flex flex-col items-center justify-between gap-8 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200/60 min-h-[550px]">
            {children}
          </main>

          {/* НИЖНИЙ БЛОК РЕКЛАМЫ */}
          <div className="w-full max-w-[728px] h-[90px] bg-white border border-slate-200 rounded-xl flex items-center justify-center text-center text-slate-400 shrink-0 shadow-sm">
            Нижний рекламный блок (728х90)
          </div>

        </div>

        {/* ПРАВАЯ РЕКЛАМА */}
        <aside className="hidden xl:flex w-[200px] h-[600px] bg-white border border-slate-200 rounded-xl p-4 items-center justify-center text-center text-slate-400 shrink-0 sticky top-6 shadow-sm">
          Реклама <br /> (Небоскреб)
        </aside>
      </div>

      {/* ПОДВАЛ */}
      <footer className="w-full text-center text-xs text-slate-400 py-4 mt-auto border-t border-slate-200/50 bg-white/50 backdrop-blur-sm">
        &copy; {new Date().getFullYear()} Конверт. Все права защищены.
      </footer>
    </div>
  );
}