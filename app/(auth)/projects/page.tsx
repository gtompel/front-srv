"use client";

import ProjectList from '@/components/projects/ProjectList';

export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Управление проектами</h1>
      <ProjectList />
    </div>
  );
}