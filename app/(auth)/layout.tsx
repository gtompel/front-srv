/**
 * Защищённый layout для авторизованных маршрутов
 * Проверяет сессию и редиректит неавторизованных пользователей
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MainWrapper } from "@/components/layout/Main-Wrapper";
import Sidebar from "@/components/layout/Sidebar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Показываем загрузку пока проверяем авторизацию
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-sm text-slate-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Не рендерим контент если не авторизован (редирект уже произошёл)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex min-w-0 flex-col">
        <Header />
        <MainWrapper>{children}</MainWrapper>
        <Footer />
      </div>
    </div>
  );
}

