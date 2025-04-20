import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import {
  fetchFeatures,
  createFeature,
  updateFeature,
  deleteFeature,
} from "./thunks";
import type { Feature } from "@/types/entities/features";

const adapter = createEntityAdapter<Feature>();

interface FeaturesState {
  entities: ReturnType<typeof adapter.getInitialState>["entities"];
  ids: ReturnType<typeof adapter.getInitialState>["ids"];
  byProjectId: Record<string, string[]>;
  statusByProject: Record<string, "idle" | "loading" | "succeeded" | "failed">;
  errorByProject: Record<string, string | undefined>;
}

const initialState: FeaturesState = {
  ...adapter.getInitialState(),
  byProjectId: {},
  statusByProject: {},
  errorByProject: {},
};

export const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchFeatures
      .addCase(fetchFeatures.pending, (state, { meta }) => {
        const pid = meta.arg;
        state.statusByProject[pid] = "loading";
        state.errorByProject[pid] = undefined;
      })
      .addCase(fetchFeatures.fulfilled, (state, { payload, meta }) => {
        const pid = meta.arg;
        state.statusByProject[pid] = "succeeded";
        adapter.setAll(state, payload);
        state.byProjectId[pid] = payload.map((f) => f.id);
      })
      .addCase(fetchFeatures.rejected, (state, { payload, meta, error }) => {
        const pid = meta.arg;
        state.statusByProject[pid] = "failed";
        const err = payload;
        state.errorByProject[pid] =
          typeof err === "string" ? err : error.message;
      })

      // createFeature
      .addCase(createFeature.pending, (state, { meta }) => {
        const pid = (meta.arg as Partial<Feature>).projectId!;
        state.statusByProject[pid] = "loading";
        state.errorByProject[pid] = undefined;
      })
      .addCase(createFeature.fulfilled, (state, { payload }) => {
        const pid = payload.projectId;
        state.statusByProject[pid] = "succeeded";
        adapter.addOne(state, payload);
        state.byProjectId[pid] = state.byProjectId[pid] || [];
        state.byProjectId[pid].push(payload.id);
      })
      .addCase(createFeature.rejected, (state, { payload, meta, error }) => {
        const pid = (meta.arg as Partial<Feature>).projectId!;
        state.statusByProject[pid] = "failed";
        const err = payload;
        state.errorByProject[pid] =
          typeof err === "string" ? err : error.message;
      })

      // updateFeature
      .addCase(updateFeature.pending, (state, { meta }) => {
        const pid = (meta.arg as Feature).projectId;
        state.statusByProject[pid] = "loading";
        state.errorByProject[pid] = undefined;
      })
      .addCase(updateFeature.fulfilled, (state, { payload }) => {
        const pid = payload.projectId;
        state.statusByProject[pid] = "succeeded";
        adapter.upsertOne(state, payload);
      })
      .addCase(updateFeature.rejected, (state, { payload, meta, error }) => {
        const pid = (meta.arg as Feature).projectId;
        state.statusByProject[pid] = "failed";
        const err = payload;
        state.errorByProject[pid] =
          typeof err === "string" ? err : error.message;
      })
      // deleteFeature
      .addCase(deleteFeature.pending, (state, { meta }) => {
        const pid = (meta.arg as Partial<Feature>).projectId!;
        state.statusByProject[pid] = "loading";
        state.errorByProject[pid] = undefined;
      })
      .addCase(deleteFeature.fulfilled, (state, { meta }) => {
        const pid = (meta.arg as Partial<Feature>).projectId!;
        const featureId = meta.arg.featureId;
        state.statusByProject[pid] = "succeeded";
        adapter.removeOne(state, featureId);
        state.byProjectId[pid] =
          state.byProjectId[pid]?.filter((id) => id !== featureId) ?? [];
      })
      .addCase(deleteFeature.rejected, (state, { payload, meta, error }) => {
        const pid = (meta.arg as Partial<Feature>).projectId!;
        state.statusByProject[pid] = "failed";
        const err = payload;
        state.errorByProject[pid] =
          typeof err === "string" ? err : error.message;
      });
  },
});

export default featuresSlice.reducer;
