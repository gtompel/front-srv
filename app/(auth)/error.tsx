"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { AlertCircle, RefreshCw, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { logout } = useAuth();

  useEffect(() => {
    // Логируем ошибку в систему мониторинга
    console.error("Auth section error:", error);
  }, [error]);

  const handleLogout = async () => {
    await logout();
    reset();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ошибка приложения
          </h1>
          <p className="text-gray-600 mb-4">
            Произошла ошибка при загрузке данных. Вы можете попробовать обновить страницу или выйти из системы.
          </p>
          {error.digest && (
            <p className="text-xs text-gray-500 mb-4">
              Код ошибки: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            variant="solid"
            className="flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Попробовать снова
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
}

