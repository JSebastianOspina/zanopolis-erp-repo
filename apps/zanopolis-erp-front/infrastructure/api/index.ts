import { realClient } from "./client";
import { mockClient } from "./mock-client";
import type { IApiClient } from "./types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const apiClient: IApiClient = USE_MOCK ? mockClient : realClient;

export { realClient, mockClient };
export type { IApiClient };
