"use client";

import Link from "next/link";
import { Bell, Search, LogOut, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { getNotifications } from "@/lib/auth/api";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

/**
 * Компонент верхней панели навигации (Header).
 * Включает логотип, поиск, уведомления и профиль пользователя.
 */
export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Загрузка уведомлений
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      // Обновляем уведомления каждые 30 секунд
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    }
  };

  // Закрытие уведомлений при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target) &&
        !target.closest(".notifications-button")
      ) {
        setShowNotifications(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(target) &&
        !target.closest(".profile-button")
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Обработка поиска
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Реализовать поиск через API
      console.log("Search:", searchQuery);
    }
  };

  // Получение инициалов пользователя
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 bg-muted border-b border-gray-400 flex items-center justify-between px-6 relative">
      {/* Логотип */}
      <Link
        href="/"
        className="text-shadow-md font-bold text-gray-900 hover:opacity-80 transition-opacity"
        aria-label="Главная страница"
      >
        {siteConfig.name.split(" ")[0]}{" "}
        <span className="text-red-400">&</span>{" "}
        {siteConfig.name.split(" ")[2]}
      </Link>

      {/* Правая часть */}
      <div className="flex items-center space-x-4">
        {/* Поиск */}
        <form
          onSubmit={handleSearch}
          className="relative hidden md:block"
          role="search"
        >
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder=" "
            aria-label="Поиск по проектам и технологиям"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="peer pl-10 pr-4 py-2 w-64 rounded-md bg-white border border-gray-400 text-xs placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />

          {/* Фейковый placeholder с мерцающим курсором */}
          <span
            className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none transition-opacity
                       peer-placeholder-shown:opacity-100 peer-focus:opacity-0"
            aria-hidden="true"
          >
            Поиск<span className="ml-1 inline-block animate-blink">_</span>
          </span>
        </form>

        {/* Уведомления */}
        <div className="relative" ref={notificationsRef}>
          <button
            className="notifications-button p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label={`Уведомления${unreadCount > 0 ? `, ${unreadCount} непрочитанных` : ""}`}
            aria-expanded={showNotifications}
            aria-haspopup="true"
          >
            <Bell className="h-5 w-5 text-gray-600" aria-hidden="true" />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                aria-label={`${unreadCount} непрочитанных уведомлений`}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
            </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="absolute right-0 top-full mt-2 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg"
              role="menu"
              aria-label="Уведомления"
            >
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Уведомления</h3>
              </div>
              <div
                className="p-2 space-y-2 max-h-60 overflow-y-auto"
                role="list"
                aria-live="polite"
                aria-atomic="false"
              >
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Нет уведомлений
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-3 hover:bg-gray-50 rounded cursor-pointer",
                        !notification.read && "bg-blue-50"
                      )}
                      role="listitem"
                    >
                  <p className="text-sm text-gray-900">
                        {notification.title || notification.message}
                  </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString("ru-RU", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Профиль */}
        <div className="flex items-center space-x-3 relative" ref={profileMenuRef}>
          {isAuthenticated && user ? (
            <>
              <button
                className="profile-button flex items-center space-x-2 hover:opacity-80 transition-opacity"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label="Меню профиля"
                aria-expanded={showProfileMenu}
                aria-haspopup="true"
              >
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-medium">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    getUserInitials(user.name)
                  )}
              </div>
              <span className="text-sm font-medium text-gray-900 hidden sm:block">
                  {user.name}
              </span>
              </button>

              {showProfileMenu && (
                <div
                  className="absolute right-0 top-full mt-2 z-50 w-48 bg-white border border-gray-200 rounded-lg shadow-lg"
                  role="menu"
                  aria-label="Меню профиля"
                >
                  <div className="p-2">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/settings"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                      role="menuitem"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Настройки</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Выйти</span>
                    </button>
                  </div>
            </div>
              )}
            </>
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
