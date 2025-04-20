import type { ApiRoute } from "@/types/entities/apiRoutes";

/**
 * A lighter-weight route object for generating OpenAPI specs.
 * Excludes projectId since it's passed separately.
 */
export type RouteForSpec = Pick<
  ApiRoute,
  | "path"
  | "method"
  | "summary"
  | "description"
  | "params"
  | "query"
  | "body"
  | "responses"
>;

/**
 * Generate a valid OpenAPI 3.0 document from a list of routes.
 * Filters out any invalid paths and wraps example responses under a 200 status code.
 */
export function generateOpenApiSpec(routes: RouteForSpec[], projectId: string) {
  const paths: Record<string, any> = {};

  for (const route of routes) {
    const {
      path,
      method,
      summary = "",
      description = "",
      params,
      query,
      body,
      responses,
    } = route;

    // Skip any route whose path isn't a valid URL path
    if (!path || !path.startsWith("/")) continue;
    const cleanPath = path.trim();

    if (!paths[cleanPath]) {
      paths[cleanPath] = {};
    }

    // Build unified parameters array
    const parameters: any[] = [];
    if (params && typeof params === "object") {
      for (const [name, schema] of Object.entries(params)) {
        parameters.push({ name, in: "path", required: true, schema });
      }
    }
    if (query && typeof query === "object") {
      for (const [name, schema] of Object.entries(query)) {
        parameters.push({ name, in: "query", required: false, schema });
      }
    }

    // Build requestBody if present
    let requestBody: any;
    if (body && typeof body === "object") {
      requestBody = {
        required: true,
        content: {
          "application/json": { schema: body },
        },
      };
    }

    // Wrap responses under status codes
    const specResponses: Record<string, any> = {
      "200": {
        description: "OK",
        content: {
          "application/json": {
            // Place the full example under `example`
            example: responses,
          },
        },
      },
    };

    paths[cleanPath][method.toLowerCase()] = {
      summary,
      description,
      parameters,
      ...(requestBody ? { requestBody } : {}),
      responses: specResponses,
    };
  }

  // Assemble the final OpenAPI document
  return {
    openapi: "3.0.0",
    info: {
      title: `Project ${projectId} API`, // Dynamic title per project
      version: "1.0.0",
    },
    paths,
  };
}
