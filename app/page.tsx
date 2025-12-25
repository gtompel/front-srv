"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { siteConfig } from "@/config/site";
import Button from "@/components/ui/Button";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Редирект авторизованных пользователей на дашборд
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
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

  // Не показываем лендинг если авторизован (редирект уже произошёл)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">
            {siteConfig.metadata.title.default}
        </h1>
        <p className="text-lg text-slate-700 mb-6">
            {siteConfig.metadata.description}
        </p>

        <div className="flex gap-3 justify-center mb-10">
            <Link href="/auth/login">
              <Button variant="solid" size="lg">
            Войти
              </Button>
          </Link>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Ключевые возможности
        </h2>
        <ul className="grid sm:grid-cols-2 gap-4 text-left list-disc pl-6 text-slate-700">
          <li>Управление портфелем проектов: CRUD, фазы, статусы</li>
          <li>Каталог технологий и жизненный цикл</li>
          <li>Планирование задач, зависимости и диаграмма Ганта</li>
          <li>Управление ресурсами и загрузкой сотрудников</li>
          <li>Контроль бюджета и оповещения о превышении</li>
          <li>Риски, ответственность и оперативные дайджесты</li>
        </ul>
      </div>
      </main>
      <footer className="w-full border-t bg-muted text-slate-700 px-6 py-3">
        <div className="container mx-auto text-center text-xs">
          <p>
            © {new Date().getFullYear()} {siteConfig.author} • Версия{" "}
            <span className="text-red-500 font-medium">{siteConfig.version}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
