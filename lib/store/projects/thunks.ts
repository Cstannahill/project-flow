import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Project } from "@/types/entities/projects";
import safeStringify from "fast-safe-stringify";

// Fetch all projects (fulfilled payload is Project[], no undefined)
export const fetchProjects = createAsyncThunk<
  Project[], // returned type
  void, // argument type
  { rejectValue: string }
>("projects/fetchProjects", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/projects");
    if (!res.ok) throw new Error("Failed to fetch projects");
    const data = (await res.json()) as Project[];
    return data;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

// Create a new project (fulfilled payload is Project)
export const createProject = createAsyncThunk<
  Project, // returned type
  Partial<Project>, // argument type
  { rejectValue: string }
>("projects/createProject", async (newProj, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: safeStringify(newProj),
    });
    if (!res.ok) throw new Error("Failed to create project");
    const data = (await res.json()) as Project;
    return data;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});
// Update an existing project (fulfilled payload is Project)
export const updateProject = createAsyncThunk<
  Project, // returned payload
  Project, // argument passed in
  { rejectValue: string }
>("projects/updateProject", async (projectToUpdate, { rejectWithValue }) => {
  console.log("Updating project:", projectToUpdate);
  try {
    const { id, ...payload } = projectToUpdate;
    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH", // or 'PUT' if your API expects it
      headers: { "Content-Type": "application/json" },
      body: safeStringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update project");
    const updated = (await res.json()) as Project;
    console.log("Updated Project in THunk:", updated);
    return updated;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});
export const deleteProject = createAsyncThunk<
  string, // returned payload = the deleted project’s ID
  string, // arg = the project ID to delete
  { rejectValue: string }
>("projects/deleteProject", async (projectId, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete project");
    return projectId;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

// Fetch all projects (fulfilled payload is Project[], no undefined)
export const getProjectById = createAsyncThunk<
  Project, // returned type
  string, // argument type
  { rejectValue: string }
>("projects/fetchProjects", async (projectId, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/projects/${projectId}`);
    if (!res.ok) throw new Error("Failed to fetch projects");
    const data = (await res.json()) as Project;
    return data;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});
