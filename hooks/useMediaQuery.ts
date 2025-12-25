"use client";

import { useState, useEffect } from "react";

/**
 * Хук для определения размера экрана через media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Проверяем, что мы на клиенте
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);
    
    // Устанавливаем начальное значение
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Создаём обработчик изменений
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Добавляем слушатель
    if (media.addEventListener) {
      media.addEventListener("change", listener);
    } else {
      // Fallback для старых браузеров
      media.addListener(listener);
    }

    // Очистка
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [matches, query]);

  return matches;
}

/**
 * Хук для определения мобильного устройства
 * Возвращает true если ширина экрана меньше 768px (Tailwind md breakpoint)
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

/**
 * Хук для определения планшета
 * Возвращает true если ширина экрана между 768px и 1023px
 */
export function useIsTablet(): boolean {
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  return isTablet;
}

/**
 * Хук для определения десктопа
 * Возвращает true если ширина экрана больше 1024px
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

