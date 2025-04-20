import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import {
  fetchDiagrams,
  createDiagram,
  updateDiagram,
  deleteDiagram,
} from "./thunks";
import type { Diagram } from "@/types/entities/diagrams";

const diagramsAdapter = createEntityAdapter<Diagram>();

interface DiagramsState {
  entities: ReturnType<typeof diagramsAdapter.getInitialState>["entities"];
  ids: ReturnType<typeof diagramsAdapter.getInitialState>["ids"];
  byProjectId: Record<string, string[]>;
  statusByProject: Record<string, "idle" | "loading" | "succeeded" | "failed">;
  errorByProject: Record<string, string | undefined>;
}

const initialDiagramsState: DiagramsState = {
  ...diagramsAdapter.getInitialState(),
  byProjectId: {},
  statusByProject: {},
  errorByProject: {},
};

export const diagramsSlice = createSlice({
  name: "diagrams",
  initialState: initialDiagramsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch diagrams
      .addCase(fetchDiagrams.pending, (state, { meta }) => {
        const pid = meta.arg;
        state.statusByProject[pid] = "loading";
        state.errorByProject[pid] = undefined;
      })
      .addCase(fetchDiagrams.fulfilled, (state, { payload, meta }) => {
        const pid = meta.arg;
        state.statusByProject[pid] = "succeeded";
        diagramsAdapter.setAll(state, payload);
        state.byProjectId[pid] = payload.map((d) => d.id);
      })
      .addCase(fetchDiagrams.rejected, (state, { payload, meta, error }) => {
        const pid = meta.arg;
        state.statusByProject[pid] = "failed";
        const err = payload;
        state.errorByProject[pid] =
          typeof err === "string" ? err : error.message;
      })
      // Create diagram
      .addCase(createDiagram.pending, (state, { meta }) => {
        const pid = (meta.arg as Partial<Diagram>).projectId!;
        state.statusByProject[pid] = "loading";
        state.errorByProject[pid] = undefined;
      })
      .addCase(createDiagram.fulfilled, (state, { payload }) => {
        const pid = payload.projectId;
        state.statusByProject[pid] = "succeeded";
        diagramsAdapter.addOne(state, payload);
        state.byProjectId[pid] = state.byProjectId[pid] || [];
        state.byProjectId[pid].push(payload.id);
      })
      .addCase(createDiagram.rejected, (state, { payload, meta, error }) => {
        const pid = (meta.arg as Partial<Diagram>).projectId!;
        state.statusByProject[pid] = "failed";
        const err = payload;
        state.errorByProject[pid] =
          typeof err === "string" ? err : error.message;
      })
      // Update diagram
      .addCase(updateDiagram.pending, (state, { meta }) => {
        const pid = (meta.arg as Partial<Diagram>).projectId!;
        state.statusByProject[pid] = "loading";
        state.errorByProject[pid] = undefined;
      })
      .addCase(updateDiagram.fulfilled, (state, { payload }) => {
        const pid = payload.projectId;
        state.statusByProject[pid] = "succeeded";
        diagramsAdapter.upsertOne(state, payload);
      })
      .addCase(updateDiagram.rejected, (state, { payload, meta, error }) => {
        const pid = (meta.arg as Partial<Diagram>).projectId!;
        state.statusByProject[pid] = "failed";
        const err = payload;
        state.errorByProject[pid] =
          typeof err === "string" ? err : error.message;
      })
      .addCase(deleteDiagram.pending, (state, { meta }) => {
        const id = meta.arg.id;
        const projId = state.entities[id]?.projectId;
        if (projId) {
          state.statusByProject[projId] = "loading";
          state.errorByProject[projId] = undefined;
        }
      })
      .addCase(deleteDiagram.fulfilled, (state, { meta }) => {
        const id = (meta.arg as Partial<Diagram>).id!;
        const projId = state.entities[id]?.projectId;
        if (projId) {
          diagramsAdapter.removeOne(state, id);
          state.byProjectId[projId] =
            state.byProjectId[projId]?.filter((dId) => dId !== id) || [];
          state.statusByProject[projId] = "succeeded";
        }
      })
      .addCase(deleteDiagram.rejected, (state, { meta, error, payload }) => {
        const id = meta.arg.id;
        const projId = state.entities[id]?.projectId;
        if (projId) {
          state.statusByProject[projId] = "failed";
          state.errorByProject[projId] = payload ?? error.message;
        }
      });
  },
});

export default diagramsSlice.reducer;
