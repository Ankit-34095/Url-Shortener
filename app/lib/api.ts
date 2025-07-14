const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

async function api<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  const { token, headers, ...customConfig } = options || {};

  const config: RequestInit = {
    method: options?.method || 'GET',
    ...customConfig,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json();
    return Promise.reject(error);
  }

  // Handle cases where the response might be empty (e.g., DELETE, 204 No Content)
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

export default api;







