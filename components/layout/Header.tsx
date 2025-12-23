"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
// Убран импорт cn, так как он не используется

/**
 * Компонент верхней панели навигации (Header).
 * Включает логотип, поиск, уведомления и профиль пользователя.
 */
export default function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Проверка авторизации
  useEffect(() => {
    const checkAuth = () => {
      const user =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      setIsLoggedIn(!!user);
    };
    checkAuth();
  }, []);

  // Закрытие уведомлений при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".notifications-button")) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-muted border-b border-gray-400 flex items-center justify-between px-6 relative">
      {/* Логотип */}
      <Link href="/" className="text-shadow-md font-bold text-gray-900">
        Проекты <span className="text-red-500">&</span> Технологии
      </Link>

      {/* Правая часть */}
      <div className="flex items-center space-x-4">
        {/* Поиск */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder=" "
            aria-label="Поиск"
            className="peer pl-10 pr-4 py-2 w-64 rounded-md bg-white border border-gray-400 text-xs placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />

          {/* Фейковый placeholder с мерцающим курсором */}
          <span
            className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none transition-opacity
                       peer-placeholder-shown:opacity-100 peer-focus:opacity-0"
          >
            Поиск<span className="ml-1 inline-block animate-blink">_</span>
          </span>
        </div>

        {/* Уведомления */}
        <div className="relative">
          <button
            className="notifications-button p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Уведомления"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Уведомления</h3>
              </div>
              <div className="p-2 space-y-2 max-h-60 overflow-y-auto">
                <div className="p-3 hover:bg-gray-50 rounded">
                  <p className="text-sm text-gray-900">
                    Проект «FitPortal» требует внимания
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 часа назад</p>
                </div>
                <div className="p-3 hover:bg-gray-50 rounded">
                  <p className="text-sm text-gray-900">
                    Новая версия технологии «PostgreSQL» доступна
                  </p>
                  <p className="text-xs text-gray-500 mt-1">1 день назад</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Профиль */}
        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-medium">
                А
              </div>
              <span className="text-sm font-medium text-gray-900 hidden sm:block">
                Админ
              </span>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button size="sm" className="text-sm">
                Войти
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
