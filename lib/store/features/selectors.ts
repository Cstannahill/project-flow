import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import type { Feature } from "@/types/entities/features";

// Base selectors
export const selectFeaturesState = (state: RootState) => state.features;

// Entity selectors
export const selectFeatureEntities = createSelector(
  selectFeaturesState,
  (fs) => fs.entities
);

// IDs by project
export const selectFeatureIdsByProject = (
  state: RootState,
  projectId: string
): string[] => selectFeaturesState(state).byProjectId[projectId] || [];

// Full feature objects for a project
export const selectFeaturesByProject = createSelector(
  selectFeatureEntities,
  selectFeatureIdsByProject,
  (entities, ids) => ids.map((id) => entities[id]!).filter(Boolean) as Feature[]
);

// Loading status by project
export const selectFeatureStatusByProject = (
  state: RootState,
  projectId: string
): "idle" | "loading" | "succeeded" | "failed" =>
  selectFeaturesState(state).statusByProject[projectId] || "idle";

// Error message by project
export const selectFeatureErrorByProject = (
  state: RootState,
  projectId: string
): string | undefined => selectFeaturesState(state).errorByProject[projectId];

// Optional: select a single feature by ID
export const selectFeatureById = (
  state: RootState,
  featureId: string
): Feature | undefined =>
  selectFeatureEntities(state)[featureId] as Feature | undefined;
