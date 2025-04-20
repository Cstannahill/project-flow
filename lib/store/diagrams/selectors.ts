import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import type { Diagram } from "@/types/entities/diagrams";

// Base state selector
export const selectDiagramsState = (state: RootState) => state.diagrams;

// Entity adapter selectors
export const selectDiagramEntities = createSelector(
  selectDiagramsState,
  (ds) => ds.entities
);

// IDs of diagrams belonging to a specific project
export const selectDiagramIdsByProject = (
  state: RootState,
  projectId: string
): string[] => selectDiagramsState(state).byProjectId[projectId] || [];

// Fully populated diagram objects for a project
export const selectDiagramsByProject = createSelector(
  selectDiagramEntities,
  selectDiagramIdsByProject,
  (entities, ids) => ids.map((id) => entities[id]!).filter(Boolean) as Diagram[]
);

// Loading status for diagrams by project
export const selectDiagramStatusByProject = (
  state: RootState,
  projectId: string
): "idle" | "loading" | "succeeded" | "failed" =>
  selectDiagramsState(state).statusByProject[projectId] || "idle";

// Error message for diagrams by project
export const selectDiagramErrorByProject = (
  state: RootState,
  projectId: string
): string | undefined => selectDiagramsState(state).errorByProject[projectId];

// Optional: select a single diagram by ID
export const selectDiagramById = (
  state: RootState,
  diagramId: string
): Diagram | undefined =>
  selectDiagramEntities(state)[diagramId] as Diagram | undefined;
