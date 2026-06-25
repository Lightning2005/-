import React from 'react';
import { Link } from 'react-router-dom';

export default function ContactsPage() {
  return (
    <div className="w-full max-w-3xl mx-auto text-left py-4">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Контакты</h1>
      <p className="text-slate-600 text-sm mb-8">
        Если у вас возникли вопросы по работе сервиса, предложения по сотрудничеству или вы обнаружили ошибку в работе конвертеров, свяжитесь с администрацией проекта. Мы всегда рады обратной связи.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
          <span className="text-2xl block mb-2">✉️</span>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">Электронная почта</h3>
          <a href="mailto:support@konvert.ru" className="text-blue-600 hover:underline text-base font-semibold">
            support@konvert.ru
          </a>
          <p className="text-xs text-slate-400 mt-2">Время ответа составляет от 12 до 24 часов.</p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
          <span className="text-2xl block mb-2">💻</span>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-1">Разработчик</h3>
          <p className="text-base text-slate-700 font-semibold">Сергей Быкадоров</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-blue-600 underline block mt-2"
          >
            Профиль на GitHub
          </a>
        </div>
      </div>

      <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl text-sm text-blue-800">
        <strong>Для правообладателей:</strong> Наш сервис не хранит пользовательский контент на постоянной основе. Если вы считаете, что работа сервиса как-либо нарушает ваши права, пожалуйста, направьте детальный запрос на нашу электронную почту.
      </div>

      <div className="mt-10 pt-6 border-t border-slate-100">
        <Link to="/" className="text-blue-600 hover:underline font-medium text-sm">
          ← Вернуться на главную
        </Link>
      </div>
    </div>
  );
}