import { render, screen } from "@testing-library/react";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";

// Мокаем next/link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("Footer", () => {
  it("отображает текущий год", () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  it("отображает версию из конфига", () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(siteConfig.version))).toBeInTheDocument();
  });

  it("отображает автора из конфига", () => {
    render(<Footer />);
    expect(screen.getByText(new RegExp(siteConfig.author))).toBeInTheDocument();
  });

  it("содержит ссылку на настройки", () => {
    render(<Footer />);
    const settingsLink = screen.getByRole("link", { name: /настройки/i });
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute("href", "/settings");
  });
});

