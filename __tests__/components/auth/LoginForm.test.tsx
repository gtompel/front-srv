import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/auth/LoginForm";
import * as authApi from "@/lib/auth/api";

// Мокаем API
jest.mock("@/lib/auth/api");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("рендерит форму входа", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/пароль/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /войти/i })).toBeInTheDocument();
  });

  it("валидирует email", async () => {
    render(<LoginForm />);
    const submitButton = screen.getByRole("button", { name: /войти/i });
    
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email обязателен/i)).toBeInTheDocument();
    });
  });

  it("валидирует формат email", async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /войти/i });
    
    await userEvent.type(emailInput, "invalid-email");
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/некорректный формат email/i)).toBeInTheDocument();
    });
  });

  it("валидирует пароль", async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /войти/i });
    
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/пароль обязателен/i)).toBeInTheDocument();
    });
  });

  it("валидирует минимальную длину пароля", async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole("button", { name: /войти/i });
    
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "12345");
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/минимум 6 символов/i)).toBeInTheDocument();
    });
  });

  it("отправляет форму с валидными данными", async () => {
    const mockSession = {
      user: {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        role: "admin" as const,
      },
      accessToken: "token",
      expiresAt: Date.now() + 1000000,
    };

    (authApi.login as jest.Mock).mockResolvedValue(mockSession);
    
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole("button", { name: /войти/i });
    
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("отображает ошибку при неудачном входе", async () => {
    (authApi.login as jest.Mock).mockRejectedValue(
      new Error("Неверные учетные данные")
    );
    
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole("button", { name: /войти/i });
    
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "wrongpassword");
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/неверные учетные данные/i)).toBeInTheDocument();
    });
  });

  it("переключает видимость пароля", async () => {
    render(<LoginForm />);
    const passwordInput = screen.getByLabelText(/пароль/i) as HTMLInputElement;
    const toggleButton = screen.getByRole("button", { name: /показать пароль/i });
    
    expect(passwordInput.type).toBe("password");
    
    await userEvent.click(toggleButton);
    
    expect(passwordInput.type).toBe("text");
    expect(screen.getByRole("button", { name: /скрыть пароль/i })).toBeInTheDocument();
  });

  it("показывает состояние загрузки", async () => {
    (authApi.login as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/пароль/i);
    const submitButton = screen.getByRole("button", { name: /войти/i });
    
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute("aria-busy", "true");
  });
});

