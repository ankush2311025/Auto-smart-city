import { APP_CONFIG } from '../config/appConfig';

export const apiClient = {
  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}${path}`);
    if (!res.ok) throw new Error(`API GET ${path} failed: ${res.status}`);
    return res.json();
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`API POST ${path} failed: ${res.status}`);
    return res.json();
  },
};
