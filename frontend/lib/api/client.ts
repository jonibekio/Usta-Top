/**
 * Django REST Framework API Client Abstraction
 * Ready for endpoints like:
 * POST /auth/login/
 * GET /providers/
 * POST /requests/
 * etc.
 * When backend is not available, falls back safely to mock data with a slight simulated delay.
 */

const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "/api/v1";
  }
  return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
};

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

class ApiClient {
  private getBaseUrl(): string {
    return getBaseUrl();
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("usta_top_token");
  }

  private setToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem("usta_top_token", token);
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...rest } = options;
    const baseUrl = this.getBaseUrl();
    let url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined) searchParams.append(key, String(val));
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }

    const token = this.getToken();
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        headers: {
          ...defaultHeaders,
          ...(headers as Record<string, string>),
        },
        ...rest,
      });

      if (!response.ok) {
        // In case of 401, handle refresh token or signout
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      // Re-throw so caller or mock fallback handles it
      throw error;
    }
  }

  public get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  public post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();

export function extractApiData<T>(payload: any): T {
  if (!payload) return payload as T;
  if (payload.data !== undefined) {
    if (payload.data && Array.isArray(payload.data.results)) {
      return payload.data.results as T;
    }
    return payload.data as T;
  }
  if (Array.isArray(payload.results)) {
    return payload.results as T;
  }
  return payload as T;
}
