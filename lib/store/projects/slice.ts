import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "./thunks";
import type { Project } from "@/types/entities/projects";

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  status: "idle",
  error: undefined,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setCurrentProject(state, action: PayloadAction<Project | null>) {
      state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(fetchProjects.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.projects = payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        const err = action.payload;
        state.error = typeof err === "string" ? err : action.error.message;
      })
      // Create a new project
      .addCase(createProject.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(createProject.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.projects.push(payload);
        state.currentProject = payload;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.status = "failed";
        const err = action.payload;
        state.error = typeof err === "string" ? err : action.error.message;
      })
      //  UPDATE
      .addCase(updateProject.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(updateProject.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        // 1) update in the list
        const idx = state.projects.findIndex((p) => p.id === payload.id);
        if (idx !== -1) {
          state.projects[idx] = payload;
        }
        // 2) refresh currentProject if it was the same
        if (state.currentProject?.id === payload.id) {
          state.currentProject = payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.status = "failed";
        const err = action.payload;
        state.error = typeof err === "string" ? err : action.error.message;
      })
      // DELETE
      .addCase(deleteProject.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(deleteProject.fulfilled, (state, { payload: deletedId }) => {
        state.status = "succeeded";
        // remove from list
        state.projects = state.projects.filter((p) => p.id !== deletedId);
        // clear currentProject if it was the one deleted
        if (state.currentProject?.id === deletedId) {
          state.currentProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, { payload, error }) => {
        state.status = "failed";
        const err = payload;
        state.error = typeof err === "string" ? err : error.message;
      });
  },
});

export const { setCurrentProject } = projectsSlice.actions;

export default projectsSlice.reducer;
