"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Code,
  Calendar,
  CheckSquare,
  Building,
  FileText,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const navigation = [
  { name: "Панель управления", href: "/", icon: BarChart3 },
  { name: "Технологии", href: "/technologies", icon: Code },
  { name: "Проекты", href: "/projects", icon: Building },
  { name: "Задачи", href: "/tasks", icon: CheckSquare },
  { name: "Отчеты", href: "/reports", icon: FileText },
  { name: "События", href: "/events", icon: Calendar },
  { name: "Настройки", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  // ✅ Инициализация collapsed из localStorage (без effect!)
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  // ✅ Сохранение в localStorage при изменении collapsed
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(collapsed));
    }
  }, [collapsed]);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <aside
      className={cn(
        "bg-muted border-r min-h-screen transition-all duration-200 flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex items-center p-4 justify-between",
          collapsed && "justify-center",
        )}
      >
        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold text-slate-700">
              Проекты <span className="text-amber-300">&</span> Технологии
            </h1>
            <p className="text-sm text-slate-400 mt-1">Сервис учёта проектов</p>
          </div>
        )}
        <button
          className="rounded p-1 hover:bg-slate-100 bg-amber-300 transition-colors ml-auto"
          aria-label={collapsed ? "Развернуть" : "Свернуть"}
          onClick={toggleSidebar}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={collapsed ? "M7 5L12 10L7 15" : "M13 5L8 10L13 15"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <nav className={cn("px-3 space-y-3 flex-1", collapsed && "px-1")}>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="block">
              <Button
                className={cn(
                  "w-full justify-start overflow-hidden transition-all duration-200",
                  collapsed
                    ? "px-0 flex flex-col items-center h-12"
                    : "px-3 py-2",
                  isActive
                    ? "bg-sky-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white",
                )}
              >
                <item.icon
                  className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")}
                />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
