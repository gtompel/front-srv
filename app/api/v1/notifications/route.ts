import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

/**
 * Получение уведомлений пользователя
 */
export async function GET(request: NextRequest) {
  try {
    // Получаем токен из заголовка Authorization
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Токен не предоставлен" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // Валидируем токен
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { message: "Недействительный токен" },
        { status: 401 }
      );
    }

    // В реальном приложении здесь должна быть загрузка уведомлений из БД
    // Пока возвращаем тестовые данные
    const notifications = [
      {
        id: "1",
        title: "Проект «FitPortal» требует внимания",
        message: "Проект «FitPortal» требует внимания",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 часа назад
        read: false,
      },
      {
        id: "2",
        title: "Новая версия технологии «PostgreSQL» доступна",
        message: "Новая версия технологии «PostgreSQL» доступна",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 день назад
        read: false,
      },
    ];

    return NextResponse.json({
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

