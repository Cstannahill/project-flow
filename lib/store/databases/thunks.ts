import { createAsyncThunk } from "@reduxjs/toolkit";
import type { DatabaseSchema } from "@/types/entities/databases";
import safeStringify from "fast-safe-stringify";

export const fetchDatabases = createAsyncThunk<
  DatabaseSchema[],
  string,
  { rejectValue: string }
>("databases/fetchDatabases", async (projectId, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/projects/${projectId}/databases`);
    if (!res.ok) throw new Error("Failed to fetch databases");
    return await res.json();
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const createDatabase = createAsyncThunk<
  DatabaseSchema,
  Partial<DatabaseSchema>,
  { rejectValue: string }
>(
  "databases/createDatabase",
  async ({ projectId, ...db }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/databases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: safeStringify(db),
      });
      if (!res.ok) throw new Error("Failed to create database");
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const updateDatabase = createAsyncThunk<
  DatabaseSchema,
  Partial<DatabaseSchema> & { databaseId: string },
  { rejectValue: string }
>(
  "databases/updateDatabase",
  async ({ projectId, databaseId, ...db }, { rejectWithValue }) => {
    console.log("THUNK UPDATING", db, databaseId);
    try {
      const res = await fetch(`/api/databases/${databaseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: safeStringify(db),
      });
      if (!res.ok) throw new Error("Failed to update database");
      return await res.json();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const deleteDatabase = createAsyncThunk<
  { id: string },
  { id: string },
  { rejectValue: string }
>("databases/deleteDatabase", async ({ id }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/databases/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete database");
    return { id };
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});
