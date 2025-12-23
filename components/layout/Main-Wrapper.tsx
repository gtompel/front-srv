"use client";
import { useEffect, useState } from "react";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 0); // или 50-100 мс для плавного появления

    return () => clearTimeout(timer);
  }, []);

  return (
    <main
      className={`flex-1 p-2 transition-all duration-200 ${
        !isReady ? "opacity-0" : "opacity-100"
      }`}
    >
      {children}
    </main>
  );
}
