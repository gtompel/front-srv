/**
 * Обработка ошибок сети и API
 */

export class NetworkError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "NetworkError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = "Ошибка аутентификации") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = "Недостаточно прав доступа") {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Обрабатывает ошибки fetch запросов
 */
export async function handleApiError(response: Response): Promise<never> {
  let errorMessage = "Произошла ошибка при выполнении запроса";
  let statusCode = response.status;

  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || errorMessage;
  } catch {
    // Если не удалось распарсить JSON, используем стандартное сообщение
    errorMessage = response.statusText || errorMessage;
  }

  // Классификация ошибок по статус-кодам
  if (statusCode === 401) {
    throw new AuthenticationError(errorMessage);
  } else if (statusCode === 403) {
    throw new AuthorizationError(errorMessage);
  } else if (statusCode >= 500) {
    throw new NetworkError("Ошибка сервера. Попробуйте позже.", statusCode);
  } else if (statusCode >= 400) {
    throw new NetworkError(errorMessage, statusCode);
  } else {
    throw new NetworkError(errorMessage, statusCode);
  }
}

/**
 * Обрабатывает сетевые ошибки (нет соединения, таймаут и т.д.)
 */
export function handleNetworkError(error: unknown): Error {
  if (error instanceof Error) {
    // Проверяем тип сетевой ошибки
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      return new NetworkError(
        "Нет соединения с сервером. Проверьте подключение к интернету."
      );
    }
    
    if (error.message.includes("timeout")) {
      return new NetworkError("Превышено время ожидания ответа сервера.");
    }

    // Если это уже наша ошибка, возвращаем как есть
    if (error instanceof NetworkError || error instanceof AuthenticationError || error instanceof AuthorizationError) {
      return error;
    }

    // Для остальных ошибок возвращаем общее сообщение
    return new Error(error.message || "Произошла неизвестная ошибка");
  }

  return new Error("Произошла неизвестная ошибка");
}

/**
 * Безопасный fetch с обработкой ошибок
 */
export async function safeFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return response;
  } catch (error) {
    // Если это уже обработанная ошибка, пробрасываем дальше
    if (
      error instanceof NetworkError ||
      error instanceof AuthenticationError ||
      error instanceof AuthorizationError
    ) {
      throw error;
    }

    // Обрабатываем сетевые ошибки
    throw handleNetworkError(error);
  }
}

