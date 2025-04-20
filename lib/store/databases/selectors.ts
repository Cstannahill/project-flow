import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Base slice selector
export const selectDatabasesState = (state: RootState) => state.databases;

// All entities by ID
export const selectDatabaseEntities = createSelector(
  selectDatabasesState,
  (db) => db.entities
);

// IDs for a given project
export const selectDatabaseIdsByProject = (
  state: RootState,
  projectId: string
) => state.databases.byProjectId[projectId] ?? [];

// Full list of schemas for the project
export const selectDatabasesByProject = createSelector(
  selectDatabaseEntities,
  selectDatabaseIdsByProject,
  (entities, ids) => ids.map((id) => entities[id]!).filter(Boolean)
);

// 👇 Here’s your status selector:
export const selectDatabaseStatusByProject = (
  state: RootState,
  projectId: string
): "idle" | "loading" | "succeeded" | "failed" =>
  state.databases.statusByProject[projectId] ?? "idle";

// (Optionally) error selector:
export const selectDatabaseErrorByProject = (
  state: RootState,
  projectId: string
): string | undefined => state.databases.errorByProject[projectId];
