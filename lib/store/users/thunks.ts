import { createAsyncThunk } from "@reduxjs/toolkit";
import type { User, UserPreferences } from "@/types/entities/users";
import { setUser, setUserPreferences } from "@/lib/store/users";

export const persistSelectedProjectId = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("user/persistSelectedProject", async (projectId, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/users/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedProjectId: projectId }),
    });
    if (!res.ok) throw new Error("Failed to persist preference");
    const data = (await res.json()) as User;
    return data;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const hydrateUserSession = createAsyncThunk<
  { user: User; preferences: UserPreferences },
  void,
  { rejectValue: string }
>("user/hydrateSession", async (_, { dispatch, rejectWithValue }) => {
  try {
    // fetch user
    const userRes = await fetch("/api/users");
    if (!userRes.ok) throw new Error("Failed to load session");
    const userData: User = await userRes.json();
    dispatch(setUser(userData));

    // fetch preferences
    const prefsRes = await fetch("/api/users/preferences");
    if (!prefsRes.ok) throw new Error("Failed to load preferences");
    const prefsData: UserPreferences = await prefsRes.json();
    dispatch(setUserPreferences(prefsData));

    return { user: userData, preferences: prefsData };
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const updateUserPreferences = createAsyncThunk<
  UserPreferences,
  Partial<UserPreferences>,
  { rejectValue: string }
>("user/updatePreferences", async (updates, { dispatch, rejectWithValue }) => {
  try {
    const res = await fetch("/api/users/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update preferences");
    const prefs: UserPreferences = await res.json();
    dispatch(setUserPreferences(prefs));
    return prefs;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});
