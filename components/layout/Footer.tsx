export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted text-slate-700 text-shadow-md px-3 py-1  text-right text-xs">
      © {new Date().getFullYear()} Административный сервис{" "}
      <span className="text-amber-300 text-shadow-md">Версия <a className="text-red-500">0.1</a></span>
    </footer>
  );
}
