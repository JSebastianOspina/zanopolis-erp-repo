import { ApiClientError, type ApiError } from "@/shared/types/api.types";
import type { IApiClient } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

import type { ApiQueryParams } from "./types";

function buildUrl(path: string, params?: ApiQueryParams): string {
  const base = API_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${normalizedPath}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const data = text ? (JSON.parse(text) as T | ApiError) : ({} as T);

  if (!response.ok) {
    const apiError = data as ApiError;
    const detail =
      apiError.errors?.[0]?.detail ?? `Request failed with status ${response.status}`;
    throw new ApiClientError(detail, response.status, apiError.errors);
  }

  return data as T;
}

export const realClient: IApiClient = {
  async get<T>(path: string, params?: ApiQueryParams): Promise<T> {
    const response = await fetch(buildUrl(path, params), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    return parseResponse<T>(response);
  },

  async post<T>(
    path: string,
    body?: unknown,
    params?: ApiQueryParams
  ): Promise<T> {
    const response = await fetch(buildUrl(path, params), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return parseResponse<T>(response);
  },

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(buildUrl(path), {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return parseResponse<T>(response);
  },

  async delete<T>(path: string): Promise<T> {
    const response = await fetch(buildUrl(path), {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    return parseResponse<T>(response);
  },
};
