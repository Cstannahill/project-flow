import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, logout, setSelectedProjectId, setUser } from "./userSlice";
import type { Project } from "./projectSlice";
import type { RootState } from "./store";
// import { User } from "./userSlice"; // Adjust this path if your User type is elsewhere
type User = {
  name: string;
  email: string;
  selectedProjectId: string | null;
};
// ✅ 1. Login Thunk
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (
    credentials: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error("Login failed");

      const userData: User = await response.json();
      dispatch(login(userData));
      return userData;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

// ✅ 2. Logout Thunk
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { dispatch }) => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(logout());
  }
);
// ✅ 4. Hydrate User
export const hydrateUserSession = createAsyncThunk(
  "user/hydrateSession",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch("/api/user");

      if (!res.ok) throw new Error("Failed to load session");

      const user: User = await res.json();

      dispatch(setUser(user));
      if (user.selectedProjectId) {
        dispatch(setSelectedProjectId(user.selectedProjectId));
      }

      return user;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);
// // ✅ 3. Fetch User Profile
// export const fetchUserProfile = createAsyncThunk(
//   "user/fetchProfile",
//   async (_, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await fetch("/api/user");

//       if (!response.ok) throw new Error("Unable to fetch user profile");

//       const user: User = await response.json();
//       dispatch(setUser(user));
//       return user;
//     } catch (err) {
//       return rejectWithValue((err as Error).message);
//     }
//   }
// );

// ✅ Load Last Selected Project (from user object)
export const loadLastSelectedProject = createAsyncThunk(
  "user/loadLastProject",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch("/api/user");

      if (!response.ok) throw new Error("Unable to fetch user");

      const user: User = await response.json();

      if (!user.selectedProjectId) {
        throw new Error("No selected project found in user profile");
      }

      dispatch(setSelectedProjectId(user.selectedProjectId));
      return user.selectedProjectId;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

// ✅ 5. Update User Preferences
export const updateUserPreferences = createAsyncThunk(
  "user/updatePreferences",
  async (preferences: Partial<User>, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) throw new Error("Failed to update preferences");

      const updatedUser: User = await response.json();
      dispatch(setUser(updatedUser));
      return updatedUser;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

// ✅ Persist selected project in user profile
export const persistSelectedProjectId = createAsyncThunk(
  "user/persistSelectedProject",
  async (projectId: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedProjectId: projectId }),
      });

      if (!response.ok) throw new Error("Failed to persist selected project");

      const updatedUser: User = await response.json();
      dispatch(setUser(updatedUser));
      dispatch(setSelectedProjectId(updatedUser.selectedProjectId));
      return updatedUser;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);
