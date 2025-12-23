"use client";

import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "lg";
};

export default function Button({
  size = "md",
  children,
  className = "",
  ...rest
}: Props) {
  const sizes: Record<string, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      {...rest}
      className={`inline-block rounded-md bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-60 ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
