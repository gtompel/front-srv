/**
 * Утилиты для работы с JWT токенами (упрощённая версия для разработки)
 * В продакшене следует использовать библиотеку jsonwebtoken с RS256
 */

import type { JWTPayload, User } from "./types";

const SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-production";

/**
 * Кодирует строку в base64 (работает в Node.js и браузере)
 */
function base64Encode(str: string): string {
  if (typeof Buffer !== "undefined") {
    // Node.js окружение
    return Buffer.from(str, "utf-8").toString("base64");
  } else {
    // Браузерное окружение
    return btoa(unescape(encodeURIComponent(str)));
  }
}

/**
 * Создаёт JWT токен (упрощённая версия)
 * В продакшене используйте библиотеку jsonwebtoken
 */
export function createToken(user: User, expiresIn: number = 15 * 60): string {
  try {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn,
    };

    // Упрощённая версия - в продакшене используйте библиотеку
    // Для разработки просто кодируем в base64
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = base64Encode(JSON.stringify(header))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    const encodedPayload = base64Encode(JSON.stringify(payload))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    
    // В реальном приложении здесь должна быть подпись
    const signature = base64Encode(`${encodedHeader}.${encodedPayload}.${SECRET}`)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  } catch (error) {
    console.error("Error creating token:", error);
    throw new Error("Failed to create token");
  }
}

/**
 * Декодирует base64 строку (работает в Node.js и браузере)
 */
function base64Decode(str: string): string {
  if (typeof Buffer !== "undefined") {
    // Node.js окружение
    return Buffer.from(str, "base64").toString("utf-8");
  } else {
    // Браузерное окружение
    return decodeURIComponent(escape(atob(str)));
  }
}

/**
 * Валидирует и декодирует JWT токен
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Восстанавливаем padding для base64
    const payloadPart = parts[1] + "=".repeat((4 - (parts[1].length % 4)) % 4);
    const payload = JSON.parse(base64Decode(payloadPart)) as JWTPayload;
    
    // Проверяем срок действия
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

