import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import type { ApiRoute } from "@/types/entities/apiRoutes";
import {
  fetchApiRoutes,
  createApiRoute,
  updateApiRoute,
  deleteApiRoute,
} from "./thunks";

const adapter = createEntityAdapter<ApiRoute>();
const initialState = adapter.getInitialState({
  byProjectId: {} as Record<string, string[]>,
  statusByProject: {} as Record<
    string,
    "idle" | "loading" | "succeeded" | "failed"
  >,
  errorByProject: {} as Record<string, string | undefined>,
});

export const apiRoutesSlice = createSlice({
  name: "apiRoutes",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchApiRoutes.pending, (state, { meta }) => {
        const pid = meta.arg;
        state.statusByProject[pid] = "loading";
        state.errorByProject[pid] = undefined;
      })
      .addCase(fetchApiRoutes.fulfilled, (state, { payload, meta }) => {
        const pid = meta.arg;
        state.statusByProject[pid] = "succeeded";
        adapter.setAll(state, payload);
        state.byProjectId[pid] = payload.map((r) => r.id);
      })
      .addCase(fetchApiRoutes.rejected, (state, { payload, meta, error }) => {
        const pid = meta.arg;
        state.statusByProject[pid] = "failed";
        const err = payload;
        state.errorByProject[pid] =
          typeof err === "string" ? err : error.message;
      })
      // createApiRoute
      .addCase(createApiRoute.pending, (state, { meta }) => {
        const pid = (meta.arg as Partial<ApiRoute>).projectId!;
        state.statusByProject[pid] = "loading";
        state.errorByProject[pid] = undefined;
      })
      .addCase(createApiRoute.fulfilled, (state, { payload }) => {
        const pid = payload.projectId;
        state.statusByProject[pid] = "succeeded";
        adapter.addOne(state, payload);
        state.byProjectId[pid] = state.byProjectId[pid] || [];
        state.byProjectId[pid].push(payload.id);
      })
      .addCase(createApiRoute.rejected, (state, { payload, meta, error }) => {
        const pid = (meta.arg as Partial<ApiRoute>).projectId!;
        state.statusByProject[pid] = "failed";
        const err = payload;
        state.errorByProject[pid] =
          typeof err === "string" ? err : error.message;
      })
      // updateApiRoute
      .addCase(updateApiRoute.pending, (state, { meta }) => {
        const pid = (meta.arg as ApiRoute).projectId;
        state.statusByProject[pid] = "loading";
        state.errorByProject[pid] = undefined;
      })
      .addCase(updateApiRoute.fulfilled, (state, { payload }) => {
        const pid = payload.projectId;
        state.statusByProject[pid] = "succeeded";
        adapter.upsertOne(state, payload);
      })

      .addCase(updateApiRoute.rejected, (state, { payload, meta, error }) => {
        const pid = (meta.arg as ApiRoute).projectId;
        state.statusByProject[pid] = "failed";
        const err = payload;
        state.errorByProject[pid] =
          typeof err === "string" ? err : error.message;
      })
      .addCase(deleteApiRoute.pending, (state, { meta }) => {
        const pid = (meta.arg as ApiRoute).projectId;
        state.statusByProject[pid] = "loading";
        state.errorByProject[pid] = undefined;
      })
      // .addCase(deleteApiRoute.fulfilled, (state, { payload }) => {
      //   adapter.removeOne(state, payload.id);
      //   state.byProjectId[payload.projectId] = state.byProjectId[
      //     payload.projectId
      //   ].filter((id) => id !== payload.id);
      // })
      .addCase(deleteApiRoute.rejected, (state, { payload, meta, error }) => {
        const pid = (meta.arg as ApiRoute).projectId;
        state.statusByProject[pid] = "failed";
        const err = payload;
        state.errorByProject[pid] =
          typeof err === "string" ? err : error.message;
      }),
});
export default apiRoutesSlice.reducer;
