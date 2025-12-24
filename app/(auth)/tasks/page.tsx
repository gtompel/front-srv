"use client";

import TaskDashboard from '@/components/tasks/TaskDashboard';

export default function TasksPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Планирование задач</h1>
      <TaskDashboard />
    </div>
  );
}