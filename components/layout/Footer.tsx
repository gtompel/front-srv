export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted text-muted-foreground px-3 py-1  text-right text-xs">
      © {new Date().getFullYear()} Административный сервис{" "}
      <span>Версия 0.1</span>
    </footer>
  );
}
