"use client"

import { siteConfig } from "@/config/site";

export default function Footer() {
  // Получаем текущий год для автоподстановки в футере
  const currentYear = new Date().getFullYear();

  return (
    // Корневой тег футера
    // - w-full: занимает всю ширину
    // - border-t: верхняя граница
    // - bg-muted: фоновый цвет (в вашей теме)
    // - text-slate-700: цвет текста
    // - text-shadow-md: тень текста (если определена в вашей конфигурации)
    // - px-6 py-3: отступы по горизонтали и вертикали
    // - text-right: выравнивание текста по правому краю
    <footer className="w-full border-t bg-muted text-slate-700 text-shadow-md px-3 py-1 text-right">
      {/* Внутренний контейнер - flex для управления расположением элементов */}
      {/* - flex-col для мобильной колонки, sm:flex-row для строки на больших экранах */}
      {/* - items-end: выравнивание по нижнему/правому краю (для колонки) */}
      {/* - justify-end: сдвигает содержимое вправо при строке */}
      {/* - gap-2: расстояние между элементами */}
      <div className="flex flex-col sm:flex-row items-end justify-end gap-2 text-xs">
        {/* Левая часть: год и автор (в строке это будет справа из-за justify-end) */}
        <div className="flex items-center justify-between gap-4">
          {/* © Год и автор */}
          <span>
            © {currentYear} {siteConfig.author}
          </span>
          {/* Разделитель скрыт на мобильных (sm и выше показывает точку) */}
          <span className="hidden sm:inline">•</span>
        </div>

        {/* Правая часть: версия приложения */}
        <div className="flex items-center gap-2">
          <span className="text-amber-300 text-shadow-md">
            v{" "}
            <span className="text-red-500 font-medium">{siteConfig.version}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
