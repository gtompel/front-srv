/**
 * Конфигурация навигации для Sidebar
 */

import {
  BarChart3,
  Code,
  Calendar,
  CheckSquare,
  Building,
  FileText,
  Settings,
  Skull,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const navigation: NavigationItem[] = [
  { name: "Панель управления", href: "/", icon: BarChart3 },
  { name: "Технологии", href: "/technologies", icon: Code },
  { name: "Проекты", href: "/projects", icon: Building },
  { name: "Задачи", href: "/tasks", icon: CheckSquare },
  { name: "Отчеты", href: "/reports", icon: FileText },
  { name: "Риски", href: "/risks", icon: Skull },
  { name: "События", href: "/events", icon: Calendar },
  { name: "Настройки", href: "/settings", icon: Settings },
];

