import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  name: string;
  email: string;
  selectedProjectId: string | null;
};

type UserState = {
  currentUser: User | null;
};

const initialState: UserState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
    logout(state) {
      state.currentUser = null;
    },
    setSelectedProjectId(state, action: PayloadAction<string | null>) {
      if (state.currentUser) {
        state.currentUser.selectedProjectId = action.payload;
      }
    },
    setUser(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
    },
  },
});

export const { login, logout, setSelectedProjectId, setUser } =
  userSlice.actions;
export default userSlice;
