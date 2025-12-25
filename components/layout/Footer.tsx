import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-muted text-slate-700 text-shadow-md px-6 py-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-4">
          <span>
            © {currentYear} {siteConfig.author}
          </span>
          <span className="hidden sm:inline">•</span>
          <Link
            href="/settings"
            className="hover:text-slate-900 transition-colors"
          >
            Настройки
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-amber-300 text-shadow-md">
            Версия{" "}
            <span className="text-red-500 font-medium">{siteConfig.version}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
