import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Diagram } from "@/types/entities/diagrams";
import safeStringify from "fast-safe-stringify";

export const fetchDiagrams = createAsyncThunk<
  Diagram[],
  string,
  { rejectValue: string }
>("diagrams/fetchDiagrams", async (projectId, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/projects/${projectId}/diagrams`);
    if (!res.ok) throw new Error("Failed to fetch diagrams");
    return (await res.json()) as Diagram[];
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});
export const createDiagram = createAsyncThunk<
  Diagram,
  Omit<Diagram, "id" | "createdAt" | "updatedAt">,
  { rejectValue: string }
>(
  "diagrams/createDiagram",
  async ({ projectId, ...newDiagram }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/diagrams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: safeStringify(newDiagram),
      });
      if (!res.ok) throw new Error("Failed to create diagram");
      return (await res.json()) as Diagram;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);
export const updateDiagram = createAsyncThunk<
  Diagram,
  Partial<Diagram> & { id: string },
  { rejectValue: string }
>("diagrams/updateDiagram", async ({ id, ...diagram }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/diagrams/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: safeStringify(diagram),
    });
    if (!res.ok) throw new Error("Failed to update diagram");
    return (await res.json()) as Diagram;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const deleteDiagram = createAsyncThunk<
  { id: string },
  { id: string },
  { rejectValue: string }
>("diagrams/deleteDiagram", async ({ id, ...diagram }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/diagrams/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: safeStringify(diagram),
    });
    if (!res.ok) throw new Error("Failed to update diagram");
    return (await res.json()) as Diagram;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});
