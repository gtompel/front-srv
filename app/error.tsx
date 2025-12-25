"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Логируем ошибку в систему мониторинга
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Что-то пошло не так
          </h1>
          <p className="text-gray-600 mb-4">
            Произошла непредвиденная ошибка. Пожалуйста, попробуйте обновить страницу или вернуться на главную.
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
          <Link href="/">
            <Button
              variant="outline"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Home className="h-4 w-4" />
              На главную
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

