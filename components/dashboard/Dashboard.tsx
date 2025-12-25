"use client";

import { useAuth } from "@/hooks/useAuth";
import { BarChart3, Building, CheckSquare, FileText, Skull, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuth();

  // Моковые данные для демонстрации
  const stats = {
    projects: {
      total: 12,
      active: 8,
      completed: 3,
      onHold: 1,
    },
    tasks: {
      total: 45,
      inProgress: 15,
      completed: 25,
      pending: 5,
    },
    risks: {
      total: 7,
      high: 2,
      medium: 3,
      low: 2,
    },
    technologies: {
      total: 24,
      active: 18,
      deprecated: 3,
      evaluating: 3,
    },
  };

  const recentActivities = [
    { id: "1", type: "project", message: "Проект «FitPortal» перешёл в фазу разработки", time: "2 часа назад" },
    { id: "2", type: "task", message: "Завершена задача «Настройка CI/CD»", time: "5 часов назад" },
    { id: "3", type: "risk", message: "Обнаружен новый риск в проекте «E-Commerce»", time: "1 день назад" },
    { id: "4", type: "technology", message: "Добавлена новая технология «Next.js 15»", time: "2 дня назад" },
  ];

  const quickActions = [
    { name: "Создать проект", href: "/projects", icon: Building, color: "bg-blue-500" },
    { name: "Добавить задачу", href: "/tasks", icon: CheckSquare, color: "bg-green-500" },
    { name: "Зарегистрировать риск", href: "/risks", icon: Skull, color: "bg-red-500" },
    { name: "Добавить технологию", href: "/technologies", icon: BarChart3, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Приветствие */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-6 border border-emerald-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Добро пожаловать, {user?.name || "Пользователь"}!
        </h1>
        <p className="text-gray-600">
          Панель управления проектами и технологиями. Здесь вы можете отслеживать ключевые метрики и быстро
          переходить к нужным разделам.
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Проекты */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <Link
              href="/projects"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Подробнее →
            </Link>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.projects.total}</h3>
          <p className="text-sm text-gray-600 mb-2">Всего проектов</p>
          <div className="flex gap-2 text-xs">
            <span className="text-green-600">Активных: {stats.projects.active}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Завершено: {stats.projects.completed}</span>
          </div>
        </div>

        {/* Задачи */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckSquare className="h-6 w-6 text-green-600" />
            </div>
            <Link
              href="/tasks"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Подробнее →
            </Link>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.tasks.total}</h3>
          <p className="text-sm text-gray-600 mb-2">Всего задач</p>
          <div className="flex gap-2 text-xs">
            <span className="text-blue-600">В работе: {stats.tasks.inProgress}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Выполнено: {stats.tasks.completed}</span>
          </div>
        </div>

        {/* Риски */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Skull className="h-6 w-6 text-red-600" />
            </div>
            <Link
              href="/risks"
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Подробнее →
            </Link>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.risks.total}</h3>
          <p className="text-sm text-gray-600 mb-2">Активных рисков</p>
          <div className="flex gap-2 text-xs">
            <span className="text-red-600">Высоких: {stats.risks.high}</span>
            <span className="text-gray-400">•</span>
            <span className="text-yellow-600">Средних: {stats.risks.medium}</span>
          </div>
        </div>

        {/* Технологии */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <Link
              href="/technologies"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Подробнее →
            </Link>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.technologies.total}</h3>
          <p className="text-sm text-gray-600 mb-2">Технологий в каталоге</p>
          <div className="flex gap-2 text-xs">
            <span className="text-green-600">Активных: {stats.technologies.active}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Устаревших: {stats.technologies.deprecated}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Быстрые действия */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <div className={`${action.color} p-2 rounded-lg`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{action.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Последние активности */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Последние активности</h2>
              <Link
                href="/events"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Все события →
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {activity.type === "project" && <Building className="h-4 w-4 text-blue-600" />}
                    {activity.type === "task" && <CheckSquare className="h-4 w-4 text-green-600" />}
                    {activity.type === "risk" && <Skull className="h-4 w-4 text-red-600" />}
                    {activity.type === "technology" && <BarChart3 className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ключевые метрики */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Ключевые метрики
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-sm text-gray-600 mb-1">Процент выполнения задач</p>
            <p className="text-2xl font-bold text-emerald-600">
              {Math.round((stats.tasks.completed / stats.tasks.total) * 100)}%
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Активных проектов</p>
            <p className="text-2xl font-bold text-blue-600">{stats.projects.active}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Критических рисков
            </p>
            <p className="text-2xl font-bold text-red-600">{stats.risks.high}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

