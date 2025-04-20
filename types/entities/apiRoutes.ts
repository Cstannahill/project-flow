export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRoute = {
  id: string;
  projectId: string;
  method: HttpMethod;
  path: string;
  summary: string;
  description?: string;
  params?: Record<string, any>; // For path parameters
  query?: Record<string, any>; // For query parameters
  body?: Record<string, any>; // For request body schema
  responses?: Record<string, any>; // For response schema
  openApiSpec?: string; // OpenAPI spec for the route
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
  params?: Record<string, any>;
  query?: Record<string, any>;
  body?: Record<string, any>;
  responses?: Record<string, any>;
}
export interface ApiRoutePayload {
  id?: string;
  projectId?: string;
  path?: string;
  method?: HttpMethod;
  summary?: string;
  description?: string;
  params?: Record<string, any>;
  query?: Record<string, any>;
  body?: Record<string, any>;
  responses?: Record<string, any>;
  openApiSpec?: string;
}
