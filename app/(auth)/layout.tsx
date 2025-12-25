/**
 * Защищённый layout для авторизованных маршрутов
 * Проверяет сессию и редиректит неавторизованных пользователей
 */

"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useRequireAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MainWrapper from "@/components/layout/Main-Wrapper";
import Sidebar from "@/components/layout/Sidebar";
import MobileSidebar, { MobileSidebarProvider } from "@/components/layout/MobileSidebar";
import SkipLink from "@/components/layout/SkipLink";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useRequireAuth();
  const router = useRouter();
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Фокусируемся на основном контенте при навигации (для доступности)
  useEffect(() => {
    if (isAuthenticated && mainRef.current) {
      // Небольшая задержка для завершения рендеринга
      const timer = setTimeout(() => {
        mainRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, isAuthenticated]);

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
    <MobileSidebarProvider>
      {/* Skip Link для доступности */}
      <SkipLink />
      
      {/* Мобильное бургер-меню */}
      <MobileSidebar />
      
      <div className="flex min-h-screen">
        {/* Десктопный сайдбар - скрыт на мобильных */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex min-w-0 flex-col">
          <Header />
          <MainWrapper 
            ref={mainRef}
            aria-label="Основной контент приложения"
            data-testid="main-content"
            id="main-content"
          >
            {children}
          </MainWrapper>
          <Footer />
        </div>
      </div>
    </MobileSidebarProvider>
  );
}

