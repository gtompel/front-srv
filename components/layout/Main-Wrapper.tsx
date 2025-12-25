"use client";

import React, { forwardRef } from "react";

type Props = {
  children?: React.ReactNode;
  className?: string;
  "aria-label"?: string;
  "data-testid"?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * MainWrapper — удобная и доступная обёртка для основного контента страницы.
 * - ForwardRef для доступа к DOM элементу
 * - Поддержка className для кастомизации
 * - По умолчанию добавляет role="main" и aria-label
 * - tabIndex=-1 позволяет использовать Skip Link для фокусировки
 */
const MainWrapper = forwardRef<HTMLElement, Props>(
  ({ children = null, className, "aria-label": ariaLabel = "Основной контент", "data-testid": dataTestId, ...rest }, ref) => {
    return (
      <main
        ref={ref}
        role="main"
        aria-label={ariaLabel}
        tabIndex={-1}
        data-testid={dataTestId}
        className={cn(
          // базовые утилитарные классы Tailwind
          "flex-1 min-h-0 p-4 md:p-6 bg-transparent",
          // плавное появление с учётом prefers-reduced-motion
          "animate-in motion-safe:fade-in duration-200",
          // удобные опции для контейнера
          "overflow-auto",
          className
        )}
        {...rest}
      >
        {children}
      </main>
    );
  }
);

MainWrapper.displayName = "MainWrapper";

export default MainWrapper;
