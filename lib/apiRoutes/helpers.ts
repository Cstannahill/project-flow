export const apiRouteKeys = [
  "id",
  "projectId",
  "path",
  "method",
  "summary",
  "description",
  "params",
  "query",
  "body",
  "responses",
  "openApiSpec",
] as const;

export type ApiRouteKey = (typeof apiRouteKeys)[number];

export function isApiRouteKey(key: string): key is ApiRouteKey {
  return apiRouteKeys.includes(key as ApiRouteKey);
}
