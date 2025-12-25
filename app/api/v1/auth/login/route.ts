import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, verifyPassword, initializeTestUsers } from "@/lib/db/users";
import { createToken } from "@/lib/auth/jwt";
import type { User } from "@/lib/auth/types";

// Инициализируем тестовых пользователей при первом запуске
try {
  initializeTestUsers();
} catch (error) {
  console.error("Failed to initialize test users:", error);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email и пароль обязательны" },
        { status: 400 }
      );
    }

    // Находим пользователя
    const userRecord = getUserByEmail(email);
    if (!userRecord) {
      return NextResponse.json(
        { message: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    // Проверяем пароль
    const isPasswordValid = verifyPassword(userRecord, password);
    if (!isPasswordValid) {
      console.error(`Login failed for ${email}: password mismatch`);
      return NextResponse.json(
        { message: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    // Создаём пользователя для токена
    const user: User = {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role,
    };

    // Создаём токены
    const accessToken = createToken(user, 15 * 60); // 15 минут
    const refreshToken = createToken(user, 7 * 24 * 60 * 60); // 7 дней

    // Возвращаем ответ
    const response = NextResponse.json({
      user,
      accessToken,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    // Устанавливаем refresh token в HTTP-only cookie
    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 дней
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", { errorMessage, errorStack });
    
    return NextResponse.json(
      { 
        message: "Ошибка сервера",
        error: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

