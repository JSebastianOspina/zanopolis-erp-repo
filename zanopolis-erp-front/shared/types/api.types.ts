export interface ApiResource<A = Record<string, unknown>> {
  type: string;
  id: string;
  attributes: A;
}

export interface ApiSingle<A = Record<string, unknown>> {
  data: ApiResource<A>;
}

export interface ApiCollection<A = Record<string, unknown>> {
  data: ApiResource<A>[];
  meta?: { total: number };
}

export interface ApiMessage {
  message: string;
}

export interface ApiErrorItem {
  status: string;
  code: string;
  title?: string;
  detail: string;
}

export interface ApiError {
  errors: ApiErrorItem[];
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: ApiErrorItem[]
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
  [key: string]: string | number | boolean | undefined;
}
