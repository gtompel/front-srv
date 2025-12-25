import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/db/users";
import { createToken } from "@/lib/auth/jwt";
import type { User } from "@/lib/auth/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    // Валидация
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "Email, пароль и имя обязательны" },
        { status: 400 }
      );
    }

    // Проверка формата email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Некорректный формат email" },
        { status: 400 }
      );
    }

    // Проверка длины пароля
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Пароль должен содержать минимум 6 символов" },
        { status: 400 }
      );
    }

    // Проверяем, что пользователь не существует
    if (getUserByEmail(email)) {
      return NextResponse.json(
        { message: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    // Создаём пользователя
    const userRecord = createUser(
      email,
      password,
      name,
      (role as User["role"]) || "viewer"
    );

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

    const response = NextResponse.json(
      {
        user,
        accessToken,
        expiresAt: Date.now() + 15 * 60 * 1000,
      },
      { status: 201 }
    );

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
    console.error("Registration error:", error);
    
    if (error instanceof Error && error.message.includes("уже существует")) {
      return NextResponse.json(
        { message: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

