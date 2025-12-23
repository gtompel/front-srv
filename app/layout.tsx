import "./globals.css";
import type React from "react";
import { JetBrains_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MainWrapper } from "@/components/layout/Main-Wrapper";
import Sidebar from "@/components/layout/Sidebar";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={jetbrainsMono.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
            <Header>{/* меню/логотип */}</Header>
            <MainWrapper>{children}</MainWrapper>
            <Footer>{/* футер */}</Footer>
          </div>
        </div>
      </body>
    </html>
  );
}
