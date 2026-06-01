const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081/api';

interface RequestOptions extends RequestInit {
  token?: string | Promise<string | undefined | null> | null;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  details?: unknown;
}

export function formatApiError(error: unknown, fallback: string): string {
  if (error && typeof error === 'object') {
    const apiError = error as ApiError;
    const status = apiError.status ? `Status ${apiError.status}` : null;
    const message = apiError.message || fallback;
    return status ? `${message} (${status}${apiError.statusText ? ` ${apiError.statusText}` : ''})` : message;
  }

  return fallback;
}

function isJwtExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const parsed = JSON.parse(atob(payload));
    return !parsed.exp || parsed.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

async function api<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  const { token, headers, ...customConfig } = options || {};
  const resolvedToken = await Promise.resolve(token);
  const authToken = resolvedToken || (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);

  if (authToken && isJwtExpired(String(authToken))) {
    return Promise.reject({
      message: 'Session expired. Please log in again.',
      status: 401,
      statusText: 'Unauthorized',
    });
  }

  const config: RequestInit = {
    method: options?.method || 'GET',
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (authToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${authToken}`,
    };
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  const text = await response.text();

  if (!response.ok) {
    let error;
    try {
      error = JSON.parse(text);
    } catch {
      error = { message: text };
    }
    error = {
      ...error,
      message: error.message || error.error || (response.status === 401 ? 'Session expired. Please log in again.' : response.statusText) || 'Request failed',
      status: response.status,
      statusText: response.statusText,
    };
    return Promise.reject(error);
  }

  // Handle cases where the response might be empty (e.g., DELETE, 204 No Content)
  if (response.status === 204) {
    return null as T;
  }

  return JSON.parse(text);
}

export default api;







