"use client";

import { useState, useEffect, useRef, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Menu } from "lucide-react";
import { navigation } from "@/config/navigation";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

// Контекст для управления состоянием мобильного меню
const MobileSidebarContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

/**
 * Хук для доступа к контексту мобильного меню
 * Выбрасывает ошибку, если хук используется вне провайдера
 */
export function useMobileSidebar() {
  const context = useContext(MobileSidebarContext);
  if (!context) {
    throw new Error("useMobileSidebar must be used within MobileSidebarProvider");
  }
  return context;
}

/**
 * Провайдер состояния мобильного сайдбара
 * Оборачивает часть приложения, где требуется доступ к открытому/закрытому состоянию меню
 */
export function MobileSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MobileSidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MobileSidebarContext.Provider>
  );
}

/**
 * Кнопка-триггер для открытия мобильного меню
 * - видна только на мобильных (md:hidden означает скрыта на md и выше)
 * - использует общий setIsOpen из контекста
 */
export function MobileSidebarTrigger() {
  const { setIsOpen } = useMobileSidebar();

  return (
    <Button
      onClick={() => setIsOpen(true)}
      variant="ghost"
      size="xs"
      className="md:hidden p-2 hover:text-red-300"
      aria-label="Открыть меню"
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
}

/**
 * Содержимое мобильного сайдбара (бургер-меню)
 * - управляет overlay и блокировкой скролла
 * - закрывается при клике вне меню, при навигации или при нажатии Escape
 */
function MobileSidebarContent() {
  const { isOpen, setIsOpen } = useMobileSidebar();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне меню + блокировка скролла body
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Если есть ref и клик за его пределами — закрываем меню
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Блокируем прокрутку страницы, чтобы фон не скроллился
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Восстанавливаем прокрутку при размонтировании или закрытии
      document.body.style.overflow = "";
    };
  }, [isOpen, setIsOpen]);

  // При переходе по маршруту автоматически закрываем меню
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Закрытие при нажатии клавиши Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Overlay: полупрозрачный фон, закрывает меню при клике на него */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Боковая панель: анимируется через transform */}
      <div
        ref={sidebarRef}
        id="mobile-sidebar"
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-slate-100 border-r border-slate-300 z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          // Если isOpen === true — сдвигаем в видимую область, иначе скрываем за левым краем
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Мобильное меню навигации"
      >
        <div className="flex flex-col h-full">
          {/* Заголовок с кнопкой закрытия */}
          <div className="flex items-center justify-between p-4 border-b border-slate-300 bg-slate-200">
            <h2 className="text-lg font-semibold text-slate-700 text-shadow-md">Меню</h2>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="p-2"
              aria-label="Закрыть меню"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Навигация: список ссылок из конфигурации navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2" aria-label="Основная навигация">
            {navigation.map((item) => {
              // Определяем, активна ли ссылка
              // Специальный случай для /dashboard — считаем его активным и для корня /
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard" || pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");

              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)} // закрываем меню при переходе
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    "text-slate-700 hover:bg-slate-200 active:bg-slate-300",
                    isActive && "bg-amber-300 text-slate-900 font-semibold"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {/* Иконка пункта навигации */}
                  <Icon className="h-5 w-5 flex-shrink-0 text-red-300" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Блок информации о пользователе и кнопка выхода */}
          <div className="p-4 border-t border-slate-300 bg-slate-200">
            {user && (
              <div className="mb-3 px-3 py-2 rounded-lg bg-slate-100">
                <p className="text-xs text-slate-600 mb-1">Пользователь</p>
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-600">{user.email}</p>
              </div>
            )}

            <Button
              onClick={async () => {
                // Вызываем logout из хука авторизации и закрываем меню
                await logout();
                setIsOpen(false);
              }}
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <span>Выйти</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Главный экспорт: самостоятельный компонент мобильного сайдбара
 * Примечание: MobileSidebarProvider должен располагаться выше в дереве (например, в layout),
 * чтобы использовать MobileSidebarTrigger и MobileSidebarContent
 */
export default function MobileSidebar() {
  return <MobileSidebarContent />;
}
