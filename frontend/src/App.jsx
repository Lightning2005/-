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
          {/* Главная страница */}
          <Route path="/" element={<HomePage />} />

          {/* Динамический роут для инструментов, например: /jpg-to-pdf */}
          <Route path="/:source-to-:target" element={<ConverterPage />} />

          {/* Сюда можно будет добавить 404 страницу, если роут не найден */}
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}