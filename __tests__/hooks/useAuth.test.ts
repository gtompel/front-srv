import { renderHook, waitFor } from "@testing-library/react";
import { useAuth, useRequireAuth } from "@/hooks/useAuth";
import * as authApi from "@/lib/auth/api";

// Мокаем модуль API
jest.mock("@/lib/auth/api");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("возвращает начальное состояние загрузки", () => {
    (authApi.getSession as jest.Mock).mockResolvedValue(null);
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("загружает сессию при монтировании", async () => {
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

    (authApi.getSession as jest.Mock).mockResolvedValue(mockSession);
    
    const { result } = renderHook(() => useAuth());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockSession.user);
  });

  it("обрабатывает отсутствие сессии", async () => {
    (authApi.getSession as jest.Mock).mockResolvedValue(null);
    
    const { result } = renderHook(() => useAuth());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("вызывает logout и очищает сессию", async () => {
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

    (authApi.getSession as jest.Mock).mockResolvedValue(mockSession);
    (authApi.logout as jest.Mock).mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useAuth());
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
    
    await result.current.logout();
    
    expect(authApi.logout).toHaveBeenCalled();
  });
});

describe("useRequireAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("не редиректит когда пользователь авторизован", async () => {
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

    (authApi.getSession as jest.Mock).mockResolvedValue(mockSession);
    
    const { result } = renderHook(() => useRequireAuth());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.isAuthenticated).toBe(true);
  });
});

