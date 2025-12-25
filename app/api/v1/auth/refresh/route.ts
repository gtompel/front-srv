import { NextRequest, NextResponse } from "next/server";
import { verifyToken, createToken } from "@/lib/auth/jwt";
import { getUserById } from "@/lib/db/users";
import type { User } from "@/lib/auth/types";

export async function POST(request: NextRequest) {
  try {
    // Получаем refresh token из cookie
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token не найден" },
        { status: 401 }
      );
    }

    // Валидируем токен
    const payload = verifyToken(refreshToken);
    if (!payload) {
      const response = NextResponse.json(
        { message: "Недействительный refresh token" },
        { status: 401 }
      );
      // Удаляем недействительный cookie
      response.cookies.delete("refresh_token");
      return response;
    }

    // Получаем пользователя
    const userRecord = getUserById(payload.userId);
    if (!userRecord) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 401 }
      );
    }

    // Создаём нового пользователя для токена
    const user: User = {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role,
    };

    // Создаём новые токены
    const newAccessToken = createToken(user, 15 * 60); // 15 минут
    const newRefreshToken = createToken(user, 7 * 24 * 60 * 60); // 7 дней

    const response = NextResponse.json({
      accessToken: newAccessToken,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    // Обновляем refresh token в cookie
    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 дней
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

