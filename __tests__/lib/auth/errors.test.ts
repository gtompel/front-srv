import {
  NetworkError,
  AuthenticationError,
  AuthorizationError,
  handleApiError,
  handleNetworkError,
  safeFetch,
} from "@/lib/auth/errors";

// Мокаем fetch
global.fetch = jest.fn();

describe("Error Classes", () => {
  it("создаёт NetworkError с сообщением и статус-кодом", () => {
    const error = new NetworkError("Test error", 500);
    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(500);
    expect(error.name).toBe("NetworkError");
  });

  it("создаёт AuthenticationError", () => {
    const error = new AuthenticationError("Auth failed");
    expect(error.message).toBe("Auth failed");
    expect(error.name).toBe("AuthenticationError");
  });

  it("создаёт AuthorizationError", () => {
    const error = new AuthorizationError("Not authorized");
    expect(error.message).toBe("Not authorized");
    expect(error.name).toBe("AuthorizationError");
  });
});

describe("handleApiError", () => {
  it("обрабатывает 401 как AuthenticationError", async () => {
    const response = new Response(
      JSON.stringify({ message: "Unauthorized" }),
      { status: 401, statusText: "Unauthorized" }
    );

    await expect(handleApiError(response)).rejects.toThrow(AuthenticationError);
  });

  it("обрабатывает 403 как AuthorizationError", async () => {
    const response = new Response(
      JSON.stringify({ message: "Forbidden" }),
      { status: 403, statusText: "Forbidden" }
    );

    await expect(handleApiError(response)).rejects.toThrow(AuthorizationError);
  });

  it("обрабатывает 500 как NetworkError", async () => {
    const response = new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500, statusText: "Internal Server Error" }
    );

    await expect(handleApiError(response)).rejects.toThrow(NetworkError);
  });
});

describe("handleNetworkError", () => {
  it("обрабатывает ошибки сети", () => {
    const error = new Error("Failed to fetch");
    const handled = handleNetworkError(error);
    expect(handled).toBeInstanceOf(NetworkError);
    expect(handled.message).toContain("соединения");
  });

  it("обрабатывает таймауты", () => {
    const error = new Error("Request timeout");
    const handled = handleNetworkError(error);
    expect(handled).toBeInstanceOf(NetworkError);
    expect(handled.message).toContain("время ожидания");
  });

  it("возвращает существующие ошибки как есть", () => {
    const error = new AuthenticationError("Auth failed");
    const handled = handleNetworkError(error);
    expect(handled).toBe(error);
  });
});

describe("safeFetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("возвращает успешный ответ", async () => {
    const mockResponse = new Response(JSON.stringify({ data: "test" }), {
      status: 200,
    });
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const response = await safeFetch("/api/test");
    const data = await response.json();

    expect(data).toEqual({ data: "test" });
  });

  it("обрабатывает ошибки сети", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch")
    );

    await expect(safeFetch("/api/test")).rejects.toThrow(NetworkError);
  });

  it("обрабатывает HTTP ошибки", async () => {
    const mockResponse = new Response(
      JSON.stringify({ message: "Not found" }),
      { status: 404, statusText: "Not Found" }
    );
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    await expect(safeFetch("/api/test")).rejects.toThrow(NetworkError);
  });
});

