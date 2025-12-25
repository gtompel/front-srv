"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { navigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";

const STORAGE_KEY = "sidebar-collapsed";

/**
 * Безопасное чтение из localStorage с обработкой ошибок
 */
function getStoredCollapsedState(): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "true";
  } catch (error) {
    console.warn("Failed to read sidebar state from localStorage:", error);
    return false;
  }
}

/**
 * Безопасное сохранение в localStorage с обработкой ошибок
 */
function saveCollapsedState(collapsed: boolean): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  } catch (error) {
    console.warn("Failed to save sidebar state to localStorage:", error);
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Инициализация состояния после монтирования (избегаем hydration mismatch)
  useEffect(() => {
    setIsMounted(true);
    setCollapsed(getStoredCollapsedState());
  }, []);

  // Сохранение состояния в localStorage
  useEffect(() => {
    if (isMounted) {
      saveCollapsedState(collapsed);
    }
  }, [collapsed, isMounted]);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  // Предотвращаем hydration mismatch
  if (!isMounted) {
    return (
      <aside className="bg-muted border-r min-h-screen w-64 flex flex-col">
        <div className="flex items-center p-4">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "bg-muted border-r min-h-screen transition-all duration-200 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
      aria-label="Боковая панель навигации"
    >
      <div
        className={cn(
          "flex items-center p-4",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {!collapsed && (
          <div>
            <h1 className="text-xs text-shadow-md font-bold text-slate-700">
              {siteConfig.name.split(" ")[0]}{" "}
              <span className="text-amber-300">&</span>{" "}
              {siteConfig.name.split(" ")[2]}
            </h1>
            <p className="text-xs text-shadow-md text-slate-400 mt-1">
              {siteConfig.description}
            </p>
          </div>
        )}

        <Button
          className={cn(
            "rounded p-1 hover:bg-red-300 transition-colors",
            collapsed ? "" : "ml-auto"
          )}
          aria-label={collapsed ? "Развернуть боковую панель" : "Свернуть боковую панель"}
          aria-expanded={!collapsed}
          aria-controls="sidebar-navigation"
          onClick={toggleSidebar}
          size="xs"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      <nav
        id="sidebar-navigation"
        className={cn("px-3 space-y-3 flex-1", collapsed && "px-1")}
        aria-label="Основная навигация"
      >
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center w-full text-sm text-shadow-md transition-all duration-200 transform overflow-hidden rounded-md",
                "bg-muted text-slate-700",
                "hover:bg-slate-300 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
                collapsed ? "px-0 py-3 flex-col h-12 justify-center" : "px-3 py-2",
                isActive && "bg-amber-300 text-slate-900 shadow-md"
              )}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  collapsed ? "mx-auto" : "mr-3",
                  isActive ? "text-gray-900" : "text-red-300"
                )}
                aria-hidden="true"
              />
              {!collapsed && (
                <span className="truncate" aria-hidden={collapsed}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
