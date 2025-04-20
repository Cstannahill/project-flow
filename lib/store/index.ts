import { configureStore } from "@reduxjs/toolkit";

import projectsReducer from "./projects/slice";
import featuresReducer from "./features/slice";
import diagramsReducer from "./diagrams/slice";
import databasesReducer from "./databases/slice";
import apiRoutesReducer from "./apiRoutes/slice";
import userReducer from "./users/slice";

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    features: featuresReducer,
    diagrams: diagramsReducer,
    databases: databasesReducer,
    apiRoutes: apiRoutesReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
