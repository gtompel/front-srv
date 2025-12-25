/**
 * API функции для аутентификации
 */

import type { AuthSession, User } from "./types";
import {
  setAccessToken,
  clearTokens,
  getAccessToken,
  isTokenExpired,
  getUserFromToken,
  decodeJWT,
} from "./token";
import { safeFetch, handleNetworkError, AuthenticationError, handleApiError, NetworkError } from "./errors";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

/**
 * Вход в систему
 */
export async function login(
  email: string,
  password: string
): Promise<AuthSession> {
  try {
    const response = await safeFetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    // Сохраняем access токен
    if (data.accessToken) {
      setAccessToken(data.accessToken);
    }

    return data;
  } catch (error) {
    // Пробрасываем обработанные ошибки дальше
    throw handleNetworkError(error);
  }
}

/**
 * Выход из системы
 */
export async function logout(): Promise<void> {
  const token = getAccessToken();
  
  if (token) {
    try {
      await safeFetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Логируем ошибку, но не пробрасываем - выход должен произойти в любом случае
      console.error("Logout request failed:", error);
    }
  }

  clearTokens();
}

/**
 * Обновление access токена через refresh токен
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // Для получения refresh токена из cookie
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 401 - это нормально, если refresh token отсутствует или недействителен
    if (response.status === 401) {
      clearTokens();
      return null;
    }

    if (!response.ok) {
      // Для других ошибок используем стандартную обработку
      await handleApiError(response);
    }

    const data = await response.json();
    
    if (data.accessToken) {
      setAccessToken(data.accessToken);
      return data.accessToken;
    }

    return null;
  } catch (error) {
    // Если это AuthenticationError (401), это нормально - просто возвращаем null
    if (error instanceof AuthenticationError) {
      clearTokens();
      return null;
    }
    
    // Для других ошибок логируем, но всё равно возвращаем null
    // Это нормальное поведение - пользователь должен войти заново
    console.debug("Failed to refresh token:", error);
    clearTokens();
    return null;
  }
}

/**
 * Получение текущей сессии
 */
export async function getSession(): Promise<AuthSession | null> {
  const token = getAccessToken();
  
  // Если токена нет вообще, не пытаемся обновлять
  if (!token) {
    return null;
  }
  
  // Если токен истёк, пытаемся обновить
  if (isTokenExpired(token)) {
    const newToken = await refreshAccessToken();
    if (!newToken) return null;
    return getSessionFromToken(newToken);
  }

  // Токен валиден, создаём сессию
  return getSessionFromToken(token);
}

/**
 * Создаёт сессию из токена
 */
function getSessionFromToken(token: string): AuthSession | null {
  const user = getUserFromToken(token);
  
  if (!user) return null;

  const payload = decodeJWT(token);
  if (!payload) return null;

  return {
    user,
    accessToken: token,
    expiresAt: payload.exp * 1000,
  };
}

/**
 * Получение уведомлений пользователя
 */
export async function getNotifications(): Promise<
  Array<{
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
  }>
> {
  const token = getAccessToken();
  
  if (!token) return [];

  try {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // 404 - это нормально, если endpoint еще не реализован
    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      // Для других ошибок используем стандартную обработку
      await handleApiError(response);
    }

    const data = await response.json();
    return data.notifications || [];
  } catch (error) {
    // Для уведомлений не критично, если запрос не удался
    // Просто возвращаем пустой массив
    // Не логируем 404 как ошибку
    if (error instanceof NetworkError && error.statusCode === 404) {
      return [];
    }
    console.debug("Failed to fetch notifications:", error);
    return [];
  }
}

