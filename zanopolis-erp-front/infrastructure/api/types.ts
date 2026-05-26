export type ApiQueryParams = Record<string, string | number | boolean | undefined>;

export interface IApiClient {
  get<T>(path: string, params?: ApiQueryParams): Promise<T>;
  post<T>(path: string, body?: unknown, params?: ApiQueryParams): Promise<T>;
  patch<T>(path: string, body?: unknown): Promise<T>;
  delete<T>(path: string): Promise<T>;
}
