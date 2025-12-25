/**
 * Утилиты для работы с JSON базой данных пользователей
 */

import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import type { User } from "@/lib/auth/types";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

export interface UserRecord {
  id: string;
  email: string;
  password: string; // Хешированный пароль
  name: string;
  role: User["role"];
  createdAt: string;
}

/**
 * Читает всех пользователей из JSON файла
 */
export function getUsers(): UserRecord[] {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    const fileContent = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(fileContent) as UserRecord[];
  } catch (error) {
    console.error("Error reading users file:", error);
    return [];
  }
}

/**
 * Сохраняет пользователей в JSON файл
 */
export function saveUsers(users: UserRecord[]): void {
  try {
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving users file:", error);
    throw new Error("Failed to save users");
  }
}

/**
 * Находит пользователя по email
 */
export function getUserByEmail(email: string): UserRecord | null {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Находит пользователя по ID
 */
export function getUserById(id: string): UserRecord | null {
  const users = getUsers();
  return users.find((u) => u.id === id) || null;
}

/**
 * Создаёт нового пользователя
 */
export function createUser(
  email: string,
  password: string,
  name: string,
  role: User["role"] = "viewer"
): UserRecord {
  const users = getUsers();

  // Проверяем, что пользователь с таким email не существует
  if (getUserByEmail(email)) {
    throw new Error("Пользователь с таким email уже существует");
  }

  // Хешируем пароль
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser: UserRecord = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    password: hashedPassword,
    name,
    role,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return newUser;
}

/**
 * Проверяет пароль пользователя
 */
export function verifyPassword(
  user: UserRecord,
  password: string
): boolean {
  try {
    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      console.debug(`Password verification failed for user ${user.email}`);
    }
    return isValid;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}

/**
 * Инициализирует тестовых пользователей если файл не существует
 */
export function initializeTestUsers(): void {
  if (fs.existsSync(USERS_FILE)) {
    // Проверяем, что файл не пустой и содержит валидных пользователей
    const existingUsers = getUsers();
    if (existingUsers.length > 0) {
      return;
    }
  }

  const testUsers: UserRecord[] = [
    {
      id: "1",
      email: "test@test.ru",
      password: bcrypt.hashSync("ZXCasd432", 10),
      name: "Тестовый Пользователь",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      email: "pf@test.ru",
      password: bcrypt.hashSync("gfhjkm", 10),
      name: "Петр Федоров",
      role: "project_manager",
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      email: "skb@test.ru",
      password: bcrypt.hashSync("gfhjkm", 10),
      name: "Сергей Козлов",
      role: "portfolio_manager",
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      email: "gfhjkm@test.ru",
      password: bcrypt.hashSync("gfhjkm", 10),
      name: "Геннадий Иванов",
      role: "viewer",
      createdAt: new Date().toISOString(),
    },
  ];

  saveUsers(testUsers);
}

