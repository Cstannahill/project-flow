// userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import { hydrateUserSession, persistSelectedProjectId } from "./thunks";
import type { User, UserPreferences } from "@/types/entities/users";

interface UserState {
  currentUser: User | null;
  preferences: UserPreferences | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
}

const initialState: UserState = {
  currentUser: null,
  preferences: null,
  status: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.currentUser = null;
      state.status = "idle";
      state.error = undefined;
    },
    setUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    setUserPreferences(state, action: PayloadAction<UserPreferences>) {
      state.preferences = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Hydrate
      .addCase(hydrateUserSession.pending, (state) => {
        state.status = "loading";
        state.error = undefined;
      })
      .addCase(hydrateUserSession.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.currentUser = payload.user; // now correctly assign User
        state.preferences = payload.preferences; // assign UserPreferences
      })
      .addCase(hydrateUserSession.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Persist selected project
      .addCase(persistSelectedProjectId.fulfilled, (state, { payload }) => {
        state.currentUser = payload;
      });
  },
});

export const { logout, setUser, setUserPreferences } = userSlice.actions;
export default userSlice.reducer;
