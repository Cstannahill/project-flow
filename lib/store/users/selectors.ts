import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

export const selectUserState = (state: RootState) => state.user;
export const selectCurrentUser = createSelector(
  selectUserState,
  (us) => us.currentUser
);
export const selectUserStatus = createSelector(
  selectUserState,
  (us) => us.status
);
export const selectUserError = createSelector(
  selectUserState,
  (us) => us.error
);

export const selectUserPreferences = createSelector(
  selectUserState,
  (us) => us.preferences
);
