"use client";

import React, { forwardRef } from "react";

// Типы для размеров кнопки
type Size = "xs" | "sm" | "md" | "lg" | "xl";

// Типы для вариантов стилей кнопки
type Variant =
  | "solid"    // Заполненная кнопка
  | "outline"  // Контурная кнопка
  | "ghost"    // Прозрачная кнопка с hover-эффектом
  | "link"     // Стиль ссылки (без фона и отступов)
  | "danger"   // Кнопка для опасных действий (красная)
  | "success"; // Кнопка для успешных действий (зелёная)

/**
 * Пропсы компонента Button.
 * Наследуем все стандартные HTML-атрибуты кнопки и расширяем своими.
 */
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Размер кнопки */
  size?: Size;
  /** Стилевой вариант кнопки */
  variant?: Variant;
  /** Растягивать кнопку на всю ширину родителя */
  fullWidth?: boolean;
  /** Состояние загрузки: показывает спиннер и блокирует кнопку */
  loading?: boolean;
  /** Иконка (React-элемент), которая будет отображаться рядом с текстом */
  icon?: React.ReactNode;
  /** Позиция иконки: слева или справа от текста */
  iconPosition?: "left" | "right";
};

/**
 * Вспомогательная функция для объединения классов.
 * Фильтрует falsy-значения (null, undefined, false) и склеивает оставшиеся строки.
 * Аналог clsx/cn из популярных библиотек.
 */
function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Карта классов Tailwind для разных размеров кнопки.
 * Каждый размер определяет отступы, размер шрифта и радиус скругления.
 */
const sizeMap: Record<Size, string> = {
  xs: "px-2 py-0.5 text-xs rounded-sm", // Очень маленькая
  sm: "px-3 py-1 text-sm rounded-md",   // Маленькая
  md: "px-4 py-2 text-base rounded-md", // Средняя (по умолчанию)
  lg: "px-5 py-3 text-lg rounded-lg",   // Большая
  xl: "px-6 py-4 text-xl rounded-lg",   // Очень большая
};

/**
 * Карта классов Tailwind для разных стилевых вариантов.
 * Определяет цвет фона, текста, бордера и hover-эффекты.
 */
const variantMap: Record<Variant, string> = {
  // Золотистая кнопка (основной акцент)
  solid: "bg-amber-300 text-gray-900 hover:bg-amber-400 shadow-sm",
  // Прозрачная с серой рамкой
  outline: "bg-transparent border border-slate-300 text-slate-900 hover:bg-slate-50",
  // Прозрачная, без рамки, с фоном при наведении
  ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
  // Стиль гиперссылки (без отступов, с подчёркиванием при наведении)
  link: "bg-transparent underline-offset-4 hover:underline text-sky-600 p-0",
  // Красная кнопка для удаления и т.п.
  danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  // Зелёная кнопка для подтверждения
  success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm",
};

/**
 * Классы для состояния disabled.
 * Делает кнопку полупрозрачной и отключает взаимодействие.
 */
const disabledBase = "opacity-60 cursor-not-allowed pointer-events-none";

/**
 * Компонент спиннера (анимированный индикатор загрузки).
 * Использует SVG с анимацией вращения.
 */
const Spinner = ({ size = 16 }: { size?: number }) => (
  <svg
    className="animate-spin" // Встроенный класс Tailwind для вращения
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true" // Для доступности: скрываем от скринридеров
  >
    {/* Фоновая часть круга (полупрозрачная) */}
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      opacity="0.25"
    />
    {/* Активная часть (движущаяся) */}
    <path
      d="M22 12a10 10 0 00-10-10"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Основной компонент Button.
 * Реализован с использованием forwardRef для передачи ref на нативный элемент <button>.
 */
const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      // Размер и стиль (со значениями по умолчанию)
      size = "md",
      variant = "solid",
      // Поведение
      fullWidth = false,
      loading = false,
      // Иконка
      icon,
      iconPosition = "left",
      // Кастомные классы и дети
      className = "",
      children,
      // Состояние disabled (может прийти извне или задано через loading)
      disabled,
      // Остальные HTML-атрибуты (onClick, type и т.д.)
      ...rest
    },
    // ref — передаётся извне для управления фокусом, измерения и т.п.
    ref
  ) => {
    // Определяем, отключена ли кнопка (явно или через loading)
    const isDisabled = Boolean(disabled) || loading;

    // Формируем итоговый список классов
    const base = cn(
      // Базовые стили: flex, центрирование, анимация
      "inline-flex items-center justify-center transition-transform duration-150",
      // Запрет выделения текста при клике
      "select-none",
      // Классы для размера
      sizeMap[size],
      // Классы для варианта
      variantMap[variant],
      // Растягивание на всю ширину или inline
      fullWidth ? "w-full" : "inline-flex",
      // Поведение при disabled и анимация нажатия
      isDisabled
        ? disabledBase
        : "hover:-translate-y-0.5 active:translate-y-0", // Эффект "прыжка" при наведении/нажатии
      // Добавляем пользовательские классы
      className
    );

    /**
     * Карта размеров спиннера в зависимости от размера кнопки.
     * Соответствует размерам текста/кнопки для визуального баланса.
     */
    const spinnerSizeMap: Record<Size, number> = {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
    };

    return (
      <button
        ref={ref}
        {...rest} // Передаём все остальные пропсы (onClick, type и т.д.)
        disabled={isDisabled} // Блокируем кнопку, если disabled или loading
        aria-busy={loading || undefined} // Для доступности: скринридеры узнают о загрузке
        className={base}
      >
        {/* Левая часть: иконка или спиннер */}
        {loading ? (
          // Если идёт загрузка — показываем спиннер
          <span className={cn(icon ? "mr-2" : "", "flex items-center")}>
            <Spinner size={spinnerSizeMap[size]} />
          </span>
        ) : (
          // Если нет загрузки и иконка слева — показываем иконку
          icon &&
          iconPosition === "left" && (
            <span className="mr-2 flex items-center">{icon}</span>
          )
        )}

        {/* Текст кнопки */}
        <span
          className={cn(
            // Для link-варианта убираем лишние отступы (p-0 уже задан в variantMap)
            variant === "link" ? "inline" : "inline"
          )}
        >
          {children}
        </span>

        {/* Правая иконка (только если нет загрузки) */}
        {!loading && icon && iconPosition === "right" && (
          <span className="ml-2 flex items-center">{icon}</span>
        )}
      </button>
    );
  }
);

// Устанавливаем имя компонента для лучшей отладки в DevTools
Button.displayName = "Button";

export default Button;