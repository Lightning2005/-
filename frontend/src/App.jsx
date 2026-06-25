import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './pages/HomePage';
import ConverterPage from './pages/ConverterPage';

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Переносим инструменты на явный эндпоинт для безопасности роутинга и SEO */}
          <Route path="/tool/:slug" element={<ConverterPage />} />
          {/* Сюда в будущем легко встанут /about, /privacy, /faq */}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}