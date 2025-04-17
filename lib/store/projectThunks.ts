// /lib/store/projectThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setProjects, addProject, setLoading, setError } from "./projectSlice";
import { Project } from "./projectSlice";

export const fetchProjects = createAsyncThunk(
  "fetchProjects",
  async (_, { dispatch, rejectWithValue }) => {
    console.log("Fetching projects...");
    try {
      dispatch(setLoading(true));
      const response = await fetch("/api/projects");
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      dispatch(setProjects(data));
    } catch (error) {
      dispatch(setError((error as Error).message));
      return rejectWithValue(error);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const setCurrentProject = createAsyncThunk(
  "project/setCurrentProject",
  async (projectToUpdate: Project, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`/api/projects/${projectToUpdate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectToUpdate),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }
      const data = await response.json();
      dispatch(setCurrentProject(data));
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
export const createProject = createAsyncThunk(
  "project/createProject",
  async (newProject: Project, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      const data = await response.json();

      // Then dispatch the standard addProject reducer to store it locally
      dispatch(addProject(data));
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
