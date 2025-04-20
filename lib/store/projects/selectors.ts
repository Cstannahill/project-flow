import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

export const selectProjectsState = (state: RootState) => state.projects;
export const selectProjects = createSelector(
  selectProjectsState,
  (projectsState) => projectsState.projects
);
export const selectCurrentProject = createSelector(
  selectProjectsState,
  (projectsState) => projectsState.currentProject
);
export const selectProjectsStatus = createSelector(
  selectProjectsState,
  (projectsState) => projectsState.status
);
export const selectProjectsError = createSelector(
  selectProjectsState,
  (projectsState) => projectsState.error
);
export const selectCurrentProjectId = createSelector(
  selectProjectsState,
  (projectsState) => projectsState.currentProject?.id
);
