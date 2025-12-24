"use client";

import EventDashboard from '@/components/events/EventDashboard';

export default function EventPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Управление событиями</h1>
      <EventDashboard/>
    </div>
  );
}