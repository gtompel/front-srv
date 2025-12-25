"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

// Ключ в localStorage для хранения состояния сворачивания сайдбара
const STORAGE_KEY = "sidebar-collapsed";

/**
 * Безопасное чтение из localStorage с обработкой ошибок
 * Возвращает boolean — true, если сайдбар свернут
 */
function getStoredCollapsedState(): boolean {
  // На сервере localStorage недоступен — возвращаем значение по умолчанию
  if (typeof window === "undefined") return false;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "true";
  } catch (error) {
    // В случае ошибки (например, доступ запрещён) — логируем и возвращаем значение по умолчанию
    console.warn("Failed to read sidebar state from localStorage:", error);
    return false;
  }
}

/**
 * Безопасное сохранение в localStorage с обработкой ошибок
 */
function saveCollapsedState(collapsed: boolean): void {
  // На сервере localStorage недоступен — ничего не делаем
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  } catch (error) {
    // В случае ошибки (например, в приватном режиме), просто логируем
    console.warn("Failed to save sidebar state to localStorage:", error);
  }
}

export default function Sidebar() {
  // pathname используется для определения активного пункта навигации
  const pathname = usePathname();

  // collapsed — состояние свернутого сайдбара
  const [collapsed, setCollapsed] = useState(false);
  // isMounted используется, чтобы избежать расхождений при гидратации (hydration mismatch)
  const [isMounted, setIsMounted] = useState(false);

  // Инициализация состояния после монтирования компонента в браузере
  useEffect(() => {
    setIsMounted(true);
    // Читаем предыдущее состояние из localStorage (если доступно)
    setCollapsed(getStoredCollapsedState());
  }, []);

  // Сохраняем состояние свернутости в localStorage при его изменении
  useEffect(() => {
    // Флаг isMounted предотвращает запись при SSR и первом рендере
    if (isMounted) {
      saveCollapsedState(collapsed);
    }
  }, [collapsed, isMounted]);

  const toggleSidebar = () => {
    // Переключаем состояние collapsed
    setCollapsed((prev) => !prev);
  };

  // Пока компонент не смонтирован в браузере — рендерим заглушку
  // Это предотвращает несоответствие разметки между сервером и клиентом
  if (!isMounted) {
    return (
      <aside className="bg-muted border-r min-h-screen w-64 flex flex-col">
        <div className="flex items-center p-4">
          {/* Пульсирующий элемент-заглушка для имени/лога */}
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </aside>
    );
  }

  return (
    <aside
      // Ширина сайдбара меняется в зависимости от collapsed
      className={cn(
        "bg-muted border-r min-h-screen transition-all duration-200 flex flex-col",
        collapsed ? "w-16" : "w-60"
      )}
      aria-label="Боковая панель навигации"
    >
      <div
        // Хедер: логотип/название и кнопка-сворачиватель
        className={cn(
          "flex items-center p-4",
          // Если свернут — центрируем содержимое, иначе распределяем по краям
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {/*
          Если сайдбар не свернут — показываем название и описание из siteConfig.
          siteConfig.name ожидается в формате, где можно вызвать split(" ").
          При необходимости можно упростить отображение, чтобы избежать ошибок при других названиях.
        */}
        {!collapsed && (
          <div>
            <h1 className="text-xs text-shadow-md font-bold text-slate-700">
              {siteConfig.name.split(" ")[0]}{" "}
              <span className="text-amber-300">&</span>{" "}
              {siteConfig.name.split(" ")[2]}
            </h1>
            <p className="text-xs text-shadow-md text-slate-400 mt-1">
              {siteConfig.description}
            </p>
          </div>
        )}

        <Button
          // Кнопка изменения состояния сайдбара
          className={cn(
            "rounded p-1 hover:bg-red-300 transition-colors",
            collapsed ? "" : "ml-auto"
          )}
          // aria-label зависит от текущего состояния — важно для скринридеров
          aria-label={collapsed ? "Развернуть боковую панель" : "Свернуть боковую панель"}
          // aria-expanded показывает, развернут ли сейчас навигационный контрол
          aria-expanded={!collapsed}
          // aria-controls указывает на id навигационной секции
          aria-controls="sidebar-navigation"
          onClick={toggleSidebar}
          size="xs"
        >
          {/* Иконка меняется в зависимости от collapsed */}
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <nav
        id="sidebar-navigation"
        // Меняем внутренние отступы для свернутого состояния
        className={cn("px-3 space-y-3 flex-1", collapsed && "px-1")}
        aria-label="Основная навигация"
      >
        {navigation.map((item) => {
          // Логика определения активного пункта навигации
          // Для /dashboard считаем активным также корневой путь /
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard" || pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              // Важно сохранять поведение клавиатурной навигации и доступности
              className={cn(
                "group flex items-center w-full text-sm text-shadow-md transition-all duration-200 transform overflow-hidden rounded-md",
                "bg-muted text-slate-700",
                "hover:bg-slate-300 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0",
                "focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2",
                // Разные классы для свернутого и развернутого состояния
                collapsed ? "px-0 py-3 flex-col h-12 justify-center" : "px-3 py-2",
                // Активный пункт подсвечивается
                isActive && "bg-amber-300 text-slate-900 shadow-md"
              )}
              // aria-current указывает, что это текущая страница
              aria-current={isActive ? "page" : undefined}
              // При свернутом сайдбаре показываем title для hover/tooltip
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  collapsed ? "mx-auto" : "mr-3",
                  isActive ? "text-gray-900" : "text-red-300"
                )}
                aria-hidden="true" // Иконки считаются декоративными
              />

              {/* Текст пункта навигации скрывается в свернутом состоянии */}
              {!collapsed && (
                <span className="truncate" aria-hidden={collapsed}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
