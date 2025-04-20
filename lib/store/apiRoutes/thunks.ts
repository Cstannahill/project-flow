import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  ApiRoute,
  ApiRouteCreatePayload,
} from "@/types/entities/apiRoutes";
import safeStringify from "fast-safe-stringify";

export const fetchApiRoutes = createAsyncThunk<
  ApiRoute[],
  string,
  { rejectValue: string }
>("apiRoutes/fetchApiRoutes", async (projectId, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/projects/${projectId}/apis`);
    if (!res.ok) throw new Error("Failed to fetch api routes");
    return await res.json();
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});
export const createApiRoute = createAsyncThunk<
  ApiRoute,
  Partial<ApiRoute> & { projectId: string },
  { rejectValue: string }
>(
  "apiRoutes/createApiRoute",
  async ({ projectId, ...route }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/apis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: safeStringify(route),
      });
      if (!res.ok) throw new Error("Failed to create route");
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);
export const updateApiRoute = createAsyncThunk<
  ApiRoute,
  Partial<ApiRoute>,
  { rejectValue: string }
>("apiRoutes/updateApiRoute", async (route, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/apis/${route.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: safeStringify(route),
    });
    if (!res.ok) throw new Error("Failed to update api route");
    return await res.json();
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const deleteApiRoute = createAsyncThunk<
  { id: string },
  { id: string },
  { rejectValue: string }
>("apiRoutes/deleteApiRoute", async ({ id }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/apis/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to delete api route");
    return { id };
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});
export const rebuildOpenApiSpec = createAsyncThunk<
  void,
  { projectId: string },
  { rejectValue: string }
>(
  "apiRoutes/rebuildOpenApiSpec",
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `/api/projects/${projectId}/openapi-spec/rebuild`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "My API", // <-- supply real values
            description: "Auto‑generated spec",
            version: "1.0.0",
          }),
        },
      );
      return;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchOpenApiSpec = createAsyncThunk<
  { spec: any },
  { projectId: string },
  { rejectValue: string }
>("apiRoutes/fetchOpenApiSpec", async ({ projectId }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/projects/${projectId}/openapi-spec`);
    if (!res.ok) throw new Error("Failed to fetch OpenAPI spec");
    return await res.json();
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});
