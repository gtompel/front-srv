"use client";

import Link from "next/link"; // Next.js-компонент для клиентской навигации
import { usePathname } from "next/navigation"; // хук Next.js для получения текущего пути
import {
  BarChart3,
  Code,
  Calendar,
  CheckSquare,
  Building,
  FileText,
  Settings,
  Skull,
  ChevronLeft,
  ChevronRight
} from "lucide-react"; // иконки из lucide-react
import { useEffect, useState } from "react"; // React хуки
import { cn } from "@/lib/utils"; // утилита для условного объединения классов (classNames)
import Button from "@/components/ui/Button"; // кастомная кнопка (компонент UI)

/*
  navigation — массив объектов, описывающих пункты меню:
  name  - текст пункта,
  href  - путь для Link,
  icon  - компонент-иконка (lucide-react)
*/
const navigation = [
  { name: "Панель управления", href: "/", icon: BarChart3 },
  { name: "Технологии", href: "/technologies", icon: Code },
  { name: "Проекты", href: "/projects", icon: Building },
  { name: "Задачи", href: "/tasks", icon: CheckSquare },
  { name: "Отчеты", href: "/reports", icon: FileText },
  { name: "Риски", href: "/risks", icon: Skull },
  { name: "События", href: "/events", icon: Calendar },
  { name: "Настройки", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname(); // текущий путь, чтобы подсветить активный пункт

  // useState с ленивой инициализацией — читаем значение collapsed из localStorage только на клиенте.
  // Это важно для Next.js и SSR: проверяем typeof window, чтобы не обращаться к localStorage на сервере.
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false; // на сервере оставляем раскрытым
    return localStorage.getItem("sidebar-collapsed") === "true"; // читаем текущее состояние (true/false)
  });

  // useEffect сохраняет текущее состояние collapsed в localStorage при его изменении.
  // Таким образом состояние сохраняется между перезагрузками страницы.
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(collapsed));
    }
  }, [collapsed]);

  // Функция переключения состояния: сворачиваем/разворачиваем сайдбар
  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    // aside — контейнер сайдбара
    // cn объединяет базовые классы Tailwind с условными: ширина меняется в зависимости от collapsed
    <aside
      className={cn(
        "bg-muted border-r min-h-screen transition-all duration-200 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex items-center p-4 justify-between",
          collapsed && "justify-center" // при свернутом — центрируем контент хедера
        )}
      >
        {/* Заголовок и подзаголовок — показываем только когда сайдбар развернут */}
        {!collapsed && (
          <div>
            {/* Заголовок сервиса */}
            <h1 className="text-xs text-shadow-md font-bold text-slate-700">
              Проекты <span className="text-amber-300">&</span> Технологии
            </h1>
            {/* Подпись */}
            <p className="text-xs text-shadow-md text-slate-400 mt-1">
              Сервис учёта проектов
            </p>
          </div>
        )}

        {/* Кнопка сворачивания/разворачивания */}
        <Button
          className="rounded p-1 hover:bg-slate-700 transition-colors ml-auto"
          aria-label={collapsed ? "Развернуть" : "Свернуть"}
          onClick={toggleSidebar}
          size="xs"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {/* Навигация: контейнер с отступами. При collapsed уменьшаем паддинг */}
      <nav className={cn("px-3 space-y-3 flex-1", collapsed && "px-1")}>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center w-full text-sm text-shadow-md transition-all duration-200 transform overflow-hidden rounded-md",
                // фон по умолчанию — muted; текст — приглушённый
                "bg-muted text-slate-700",
                // hover — "выпуклость": лёгкий подъём + тень
                "hover:bg-slate-300 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0",
                // padding в зависимости от collapsed
                collapsed ? "px-0 py-3 flex-col h-12" : "px-3 py-2",
                // активный пункт (если нужен синий) — оставляем возможность
                isActive ? "bg-amber-300 text-slate-400 shadow-md" : ""
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5",
                  collapsed ? "mx-auto" : "mr-3",
                  isActive ? "text-gray-900" : "text-red-400"
                )}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
