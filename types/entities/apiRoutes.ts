import type { JsonValue } from "@prisma/client/runtime/library";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRoute = {
  id: string;
  projectId: string;
  method: HttpMethod;
  path: string;
  summary: string;
  description?: string;
  params?: Record<string, any> | JsonValue;
  query?: Record<string, any> | JsonValue;
  body?: Record<string, any> | JsonValue;
  responses?: Record<string, any> | JsonValue;
  openApiSpec?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface ApiRouteCreatePayload {
  id?: string; // Optional for new routes
  projectId: string;
  method: HttpMethod;
  path: string;
  summary: string;
  description?: string;
  openApiSpec?: string;
  params?: Record<string, any> | JsonValue;
  query?: Record<string, any> | JsonValue;
  body?: Record<string, any> | JsonValue;
  responses?: Record<string, any> | JsonValue;
}
export interface ApiRoutePayload {
  id?: string;
  projectId?: string;
  path?: string;
  method?: HttpMethod;
  summary?: string;
  description?: string;
  params?: Record<string, any> | JsonValue;
  query?: Record<string, any> | JsonValue;
  body?: Record<string, any> | JsonValue;
  responses?: Record<string, any> | JsonValue;
  openApiSpec?: string;
  // [key: string]: any; // Allow any other properties
}
