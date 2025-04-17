// selectors.ts
import { RootState } from "@/lib/store/store";

export const selectCurrentProjectId = (state: RootState) =>
  state?.user?.currentUser?.selectedProjectId; // adjust to match your slice shape
export const selectCurrentProject = (state: RootState) =>
  state?.project?.projects.find(
    (project) => project.id === state?.user?.currentUser?.selectedProjectId
  );
