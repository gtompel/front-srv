"use client";

import TechnologyList from '@/components/technologies/TechnologyList';

export default function TechnologiesPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Каталог технологий</h1>
      <TechnologyList />
    </div>
  );
}