import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

export const selectApiRouteStatusByProject = (
  state: RootState,
  projectId: string
): "idle" | "loading" | "succeeded" | "failed" =>
  selectApiRoutesState(state).statusByProject[projectId] || "idle";
export const selectApiRoutesStatus = (
  state: RootState,
  projectId: string
): "idle" | "loading" | "succeeded" | "failed" =>
  selectApiRouteStatusByProject(state, projectId);

export const selectApiRoutesState = (state: RootState) => state.apiRoutes;
export const selectApiRouteEntities = (state: RootState) =>
  state.apiRoutes.entities;
export const selectApiRouteIdsByProject = (
  state: RootState,
  projectId: string
) => state.apiRoutes.byProjectId[projectId] || [];
export const selectApiRoutesByProject = createSelector(
  selectApiRouteEntities,
  selectApiRouteIdsByProject,
  (entities, ids) => ids.map((id) => entities[id]!).filter(Boolean)
);
