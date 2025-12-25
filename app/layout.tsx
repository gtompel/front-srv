import "./globals.css";
import type React from "react";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.metadata.title.default,
    template: siteConfig.metadata.title.template,
  },
  description: siteConfig.metadata.description,
  keywords: siteConfig.metadata.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={jetbrainsMono.className}>{children}</body>
    </html>
  );
}
