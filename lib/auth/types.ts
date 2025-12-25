/**
 * Типы для системы аутентификации
 */

export type UserRole = "admin" | "portfolio_manager" | "project_manager" | "viewer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  expiresAt: number;
}

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  iat: number;
  exp: number;
}

