"use client";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 p-2 animate-in" role="main">
      {children}
    </main>
  );
}
