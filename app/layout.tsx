import "./globals.css";
import type React from "react";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: siteConfig.metadata.title.default,
      template: siteConfig.metadata.title.template,
    },
    description: siteConfig.metadata.description,
    keywords: [...siteConfig.metadata.keywords],
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.metadata.title.default,
      description: siteConfig.metadata.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

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
