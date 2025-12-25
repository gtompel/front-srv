"use client";

import { AlertCircle, CheckCircle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles = {
  success: {
    container: "bg-green-50 border-green-200 text-green-800",
    icon: "text-green-600",
    title: "text-green-900",
  },
  error: {
    container: "bg-red-50 border-red-200 text-red-800",
    icon: "text-red-600",
    title: "text-red-900",
  },
  warning: {
    container: "bg-yellow-50 border-yellow-200 text-yellow-800",
    icon: "text-yellow-600",
    title: "text-yellow-900",
  },
  info: {
    container: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "text-blue-600",
    title: "text-blue-900",
  },
};

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

export default function Alert({
  variant = "info",
  title,
  children,
  dismissible = false,
  onDismiss,
  className,
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible) return null;

  const styles = variantStyles[variant];
  const Icon = icons[variant];

  return (
    <div
      className={cn(
        "p-4 rounded-md border flex items-start gap-3",
        styles.container,
        className
      )}
      role="alert"
    >
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", styles.icon)} />
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={cn("font-semibold mb-1", styles.title)}>{title}</h4>
        )}
        <div className="text-sm">{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
          aria-label="Закрыть уведомление"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

