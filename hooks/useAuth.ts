/**
 * Хук для работы с аутентификацией
 */

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { AuthSession, User } from "@/lib/auth/types";
import { getSession, logout as apiLogout } from "@/lib/auth/api";
import { getAccessToken, isTokenExpired } from "@/lib/auth/token";

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Загрузка сессии
  const loadSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentSession = await getSession();
      
      if (!currentSession) {
        // Если сессии нет, очищаем состояние и перенаправляем на логин
        setSession(null);
        setIsAuthenticated(false);
        // Перенаправляем только если мы не на странице логина/регистрации
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth/")) {
          router.push("/auth/login");
        }
        return;
      }
      
      setSession(currentSession);
      setIsAuthenticated(!!currentSession);
    } catch (error) {
      // Не логируем ошибки, если это нормальное поведение (пользователь не авторизован)
      // Логируем только реальные ошибки сети или сервера
      if (error instanceof Error && !error.message.includes("401")) {
        console.error("Failed to load session:", error);
      }
      setSession(null);
      setIsAuthenticated(false);
      
      // Перенаправляем на логин при ошибке аутентификации
      if (error instanceof Error && (error.message.includes("401") || error.message.includes("Сессия истекла"))) {
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth/")) {
          router.push("/auth/login");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Выход из системы
  const logout = useCallback(async () => {
    try {
      await apiLogout();
      setSession(null);
      setIsAuthenticated(false);
      router.push("/auth/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }, [router]);

  // Получение текущего пользователя
  const user: User | null = session?.user || null;

  // Загружаем сессию при монтировании
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  return {
    session,
    user,
    isLoading,
    isAuthenticated,
    logout,
    refreshSession: loadSession,
  };
}

/**
 * Хук для защищённых маршрутов
 * Редиректит на /auth/login если пользователь не авторизован
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}

