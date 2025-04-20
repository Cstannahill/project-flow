import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import type { DatabaseSchema } from "@/types/entities/databases";
import {
  fetchDatabases,
  createDatabase,
  updateDatabase,
  deleteDatabase,
} from "./thunks";

const adapter = createEntityAdapter<DatabaseSchema>();
const initialState = adapter.getInitialState({
  byProjectId: {} as Record<string, string[]>,
  statusByProject: {} as Record<
    string,
    "idle" | "loading" | "succeeded" | "failed"
  >,
  errorByProject: {} as Record<string, string | undefined>,
});

export const databasesSlice = createSlice({
  name: "databases",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      // fetchDatabases
      .addCase(fetchDatabases.pending, (state, { meta }) => {
        const pid = meta.arg;
        state.statusByProject[pid] = "loading";
        state.errorByProject[pid] = undefined;
      })
      .addCase(fetchDatabases.fulfilled, (state, { payload, meta }) => {
        const pid = meta.arg;
        state.statusByProject[pid] = "succeeded";
        adapter.setAll(state, payload);
        state.byProjectId[pid] = payload.map((d) => d.id);
      })
      .addCase(fetchDatabases.rejected, (state, { payload, meta, error }) => {
        const pid = meta.arg;
        state.statusByProject[pid] = "failed";
        const err = payload;
        state.errorByProject[pid] =
          typeof err === "string" ? err : error.message;
      })
      // createDatabase
      .addCase(createDatabase.pending, (state, { meta }) => {
        const pid = (meta.arg as Partial<DatabaseSchema>).projectId!;
        state.statusByProject[pid] = "loading";
        state.errorByProject[pid] = undefined;
      })
      .addCase(createDatabase.fulfilled, (state, { payload }) => {
        const pid = payload.projectId;
        state.statusByProject[pid] = "succeeded";
        adapter.addOne(state, payload);
        state.byProjectId[pid] = state.byProjectId[pid] || [];
        state.byProjectId[pid].push(payload.id);
      })
      .addCase(createDatabase.rejected, (state, { payload, meta, error }) => {
        const pid = (meta.arg as Partial<DatabaseSchema>).projectId!;
        state.statusByProject[pid] = "failed";
        const err = payload;
        state.errorByProject[pid] =
          typeof err === "string" ? err : error.message;
      })
      // updateDatabase
      .addCase(updateDatabase.pending, (state, { meta }) => {
        const { projectId } = meta.arg as {
          projectId: string;
          databaseId: string;
          data: any;
        };
        state.statusByProject[projectId] = "loading";
        state.errorByProject[projectId] = undefined;
      })
      .addCase(updateDatabase.rejected, (state, { meta, error }) => {
        const { projectId } = meta.arg as {
          projectId: string;
          databaseId: string;
          data: any;
        };
        state.statusByProject[projectId] = "failed";
        state.errorByProject[projectId] = error.message;
      })
      .addCase(updateDatabase.fulfilled, (state, { payload }) => {
        const pid = payload.projectId;
        state.statusByProject[pid] = "succeeded";
        adapter.upsertOne(state, payload);
      })
      .addCase(deleteDatabase.pending, (state, { meta }) => {
        const id = (meta.arg as Partial<DatabaseSchema>).id!;
        state.statusByProject[id] = "loading";
        state.errorByProject[id] = undefined;
      })
      .addCase(deleteDatabase.fulfilled, (state, { meta }) => {
        const id = (meta.arg as Partial<DatabaseSchema>).id!;
        state.statusByProject[id] = "succeeded";
        adapter.removeOne(state, id);
        state.byProjectId[id] =
          state.byProjectId[id]?.filter((id) => id !== id) ?? [];
      })
      .addCase(deleteDatabase.rejected, (state, { payload, meta, error }) => {
        const id = (meta.arg as Partial<DatabaseSchema>).id!;
        state.statusByProject[id] = "failed";
        const err = payload;
        state.errorByProject[id] =
          typeof err === "string" ? err : error.message;
      }),
});

export default databasesSlice.reducer;
