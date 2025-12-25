/**
 * API функции для аутентификации
 */

import type { AuthSession, User } from "./types";
import {
  setAccessToken,
  clearTokens,
  getAccessToken,
  isTokenExpired,
  shouldRefreshToken,
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
 * Использует проактивное обновление токена
 */
export async function getSession(): Promise<AuthSession | null> {
  // Используем ensureValidToken для проактивного обновления
  const token = await ensureValidToken();
  
  if (!token) {
    return null;
  }

  // Создаём сессию из валидного токена
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

// Флаг для предотвращения одновременных запросов на обновление токена
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Проактивно обновляет токен, если он скоро истечёт
 * Использует кэширование, чтобы избежать множественных одновременных запросов
 */
async function ensureValidToken(): Promise<string | null> {
  const token = getAccessToken();
  
  if (!token) {
    return null;
  }

  // Если токен истёк, обязательно обновляем
  if (isTokenExpired(token)) {
    // Если уже обновляем токен, ждём завершения
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }
    
    isRefreshing = true;
    refreshPromise = refreshAccessToken();
    
    try {
      const newToken = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;
      return newToken;
    } catch (error) {
      isRefreshing = false;
      refreshPromise = null;
      return null;
    }
  }

  // Если токен скоро истечёт (менее 2 минут), обновляем заранее
  if (shouldRefreshToken(token)) {
    // Если уже обновляем токен, ждём завершения
    if (isRefreshing && refreshPromise) {
      return refreshPromise;
    }
    
    // Обновляем в фоне, не блокируя текущий запрос
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshAccessToken();
      
      refreshPromise
        .then(() => {
          isRefreshing = false;
          refreshPromise = null;
        })
        .catch(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
    }
    
    // Возвращаем текущий токен, пока обновление идёт в фоне
    return token;
  }

  // Токен валиден и не требует обновления
  return token;
}

/**
 * Выполняет авторизованный запрос с автоматическим обновлением токена
 * Обновляет токен проактивно (за 2 минуты до истечения) или при 401
 */
async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Получаем валидный токен (обновляем при необходимости)
  let token = await ensureValidToken();
  
  if (!token) {
    clearTokens();
    throw new AuthenticationError("Токен не найден или недействителен");
  }

  // Выполняем запрос
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Если получили 401, пытаемся обновить токен и повторить запрос
  if (response.status === 401) {
    // Сбрасываем флаг, чтобы можно было обновить токен
    isRefreshing = false;
    refreshPromise = null;
    
    const newToken = await refreshAccessToken();
    if (!newToken) {
      // Если не удалось обновить, очищаем токены и выбрасываем ошибку
      clearTokens();
      throw new AuthenticationError("Сессия истекла. Пожалуйста, войдите снова.");
    }
    
    // Повторяем запрос с новым токеном
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
        "Content-Type": "application/json",
      },
    });
  }

  return response;
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
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/notifications`);

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
    // Если это ошибка аутентификации, пробрасываем её дальше
    if (error instanceof AuthenticationError) {
      throw error;
    }
    
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

