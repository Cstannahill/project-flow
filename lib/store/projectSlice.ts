import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Example Project interface
export interface Project {
  id: string;
  name: string;
  description?: string;
  // Add any other fields (status, createdAt, updatedAt, etc.)
}

interface ProjectState {
  projects: Project[];
  currentProject?: Project;
  // You can also have properties like "loading" or "error"
  loading: boolean;
  error?: string;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    },
    addProject(state, action: PayloadAction<Project>) {
      state.projects.push(action.payload);
    },
    updateProject(state, action: PayloadAction<Project>) {
      const updated = action.payload;
      const index = state.projects.findIndex((p) => p.id === updated.id);
      if (index !== -1) {
        state.projects[index] = updated;
      }
    },
    removeProject(state, action: PayloadAction<string>) {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
    setCurrentProject(state, action: PayloadAction<Project | undefined>) {
      state.currentProject = action.payload;
    },
  },
});

export const {
  setProjects,
  addProject,
  updateProject,
  removeProject,
  setLoading,
  setError,
} = projectSlice.actions;

export default projectSlice;
