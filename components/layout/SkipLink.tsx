"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Skip Link - кнопка для быстрого перехода к основному контенту
 * Улучшает доступность для пользователей клавиатуры и screen readers
 */
export default function SkipLink() {
  const skipLinkRef = useRef<HTMLAnchorElement>(null);
  const mainContentRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Находим элемент main при монтировании и после навигации
  useEffect(() => {
    const mainElement = document.querySelector('main[role="main"]') as HTMLElement;
    if (mainElement) {
      mainContentRef.current = mainElement;
    }
  }, [pathname]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    const mainElement = mainContentRef.current || 
      (document.querySelector('main[role="main"]') as HTMLElement);
    
    if (mainElement) {
      // Фокусируемся на main элементе
      mainElement.focus();
      
      // Прокручиваем к началу контента
      mainElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <a
      ref={skipLinkRef}
      href="#main-content"
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:font-medium focus:transition-all"
      aria-label="Перейти к основному контенту"
    >
      Перейти к основному контенту
    </a>
  );
}

