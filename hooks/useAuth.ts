/**
 * Хук для работы с аутентификацией
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { AuthSession, User } from "@/lib/auth/types";
import { getSession, logout as apiLogout } from "@/lib/auth/api";

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
    } finally {
      setIsLoading(false);
    }
  }, []);

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

