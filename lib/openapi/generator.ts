import type { ApiRoute } from "@/types/base";

export function generateOpenApiSpec(routes: ApiRoute[], projectId: string) {
  const paths: Record<string, any> = {};

  for (const route of routes) {
    const {
      path,
      method,
      summary,
      description,
      params,
      query,
      body,
      responses,
    } = route;

    const cleanPath = path.trim().startsWith("/") ? path : `/${path}`;

    if (!paths[cleanPath]) {
      paths[cleanPath] = {};
    }

    paths[cleanPath][method.toLowerCase()] = {
      summary,
      description,
      parameters: [
        ...(params
          ? Object.entries(params).map(([name, schema]) => ({
              name,
              in: "path",
              required: true,
              schema,
            }))
          : []),
        ...(query
          ? Object.entries(query).map(([name, schema]) => ({
              name,
              in: "query",
              required: false,
              schema,
            }))
          : []),
      ],
      requestBody: body
        ? {
            required: true,
            content: {
              "application/json": {
                schema: body,
              },
            },
          }
        : undefined,
      responses: responses || {
        "200": {
          description: "Success",
        },
      },
    };
  }

  return {
    openapi: "3.0.0",
    info: {
      title: `Project ${projectId} API`,
      version: "1.0.0",
    },
    paths,
  };
}
