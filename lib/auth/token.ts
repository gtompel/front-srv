/**
 * Утилиты для работы с JWT токенами
 */

import type { JWTPayload, User } from "./types";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Сохраняет access токен в localStorage
 */
export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch (error) {
    console.error("Failed to save access token:", error);
  }
}

/**
 * Получает access токен из localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to get access token:", error);
    return null;
  }
}

/**
 * Удаляет токены из localStorage
 */
export function clearTokens(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to clear tokens:", error);
  }
}

/**
 * Декодирует base64 строку (работает в браузере)
 */
function base64DecodeBrowser(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  // Добавляем padding если нужно
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

/**
 * Декодирует JWT токен (без проверки подписи на клиенте)
 * В продакшене проверка должна быть на сервере
 */
export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const base64Url = parts[1];
    if (!base64Url) return null;
    
    // Декодируем base64 (только в браузере, на сервере используется verifyToken)
    const jsonPayload = base64DecodeBrowser(base64Url);
    return JSON.parse(jsonPayload) as JWTPayload;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

/**
 * Проверяет, истёк ли токен
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return true;
  return Date.now() >= payload.exp * 1000;
}

/**
 * Извлекает пользователя из токена
 */
export function getUserFromToken(token: string): User | null {
  const payload = decodeJWT(token);
  if (!payload || isTokenExpired(token)) return null;
  
  return {
    id: payload.userId,
    email: payload.email,
    name: payload.name || payload.email.split("@")[0], // Используем имя из токена или email
    role: payload.role,
  };
}

