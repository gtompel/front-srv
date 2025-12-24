"use client";

import ReportDashboard from '@/components/reports/ReportDashboard';

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Отчётность</h1>
      <ReportDashboard />
    </div>
  );
}