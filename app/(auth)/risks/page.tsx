"use client";

import RiskDashboard from '@/components/risks/RiskDashboard';

export default function RisksPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Управление рисками</h1>
      <RiskDashboard />
    </div>
  );
}