import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Feature } from "@/types/entities/features";
import safeStringify from "fast-safe-stringify";

// Fetch all features for a project
export const fetchFeatures = createAsyncThunk<
  Feature[],
  string,
  { rejectValue: string }
>("features/fetchFeatures", async (projectId, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/projects/${projectId}/features`);
    if (!res.ok) throw new Error("Failed to fetch features");
    return (await res.json()) as Feature[];
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

// Create a new feature
export const createFeature = createAsyncThunk<
  Feature, // the returned feature
  Omit<Feature, "id" | "createdAt" | "updatedAt">, // payload: everything except id & timestamps
  { rejectValue: string }
>("features/createFeature", async (newFeatureData, { rejectWithValue }) => {
  try {
    const { projectId, ...payload } = newFeatureData;
    const res = await fetch(`/api/projects/${projectId}/features`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: safeStringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create feature");
    return (await res.json()) as Feature;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

// Update an existing feature
export const updateFeature = createAsyncThunk<
  Feature, // returns the updated feature
  Partial<Feature> & { id: string }, // must include feature.id
  { rejectValue: string }
>("features/updateFeature", async ({ id, ...patch }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/features/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: safeStringify(patch),
    });
    if (!res.ok) throw new Error("Failed to update feature");
    return (await res.json()) as Feature;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const deleteFeature = createAsyncThunk<
  // returned payload
  { featureId: string },
  { featureId: string }, // payload: featureId only, projectId is not needed as we are deleting by featureId
  // argument: we need both projectId (to route) and featureId
  { rejectValue: string }
>("features/deleteFeature", async ({ featureId }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/features/${featureId}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete feature");
    return { featureId };
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});
