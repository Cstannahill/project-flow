// lib/hooks/useAuthSync.ts

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { hydrateUserSession, selectUserPreferences } from "@/lib/store/users";
import {
  fetchProjects,
  selectProjects,
  selectProjectsStatus,
  setCurrentProject,
} from "@/lib/store/projects";
import { Project } from "@/types/entities/projects";

/**
 * Synchronizes the authenticated user's preferences with the project context.
 * On first load, hydrates the user session, then loads project data (if idle),
 * and selects the preferred project from the loaded list.
 */
export function useAuthSync() {
  const dispatch = useAppDispatch();

  const prefs = useAppSelector(selectUserPreferences);
  const projects = useAppSelector(selectProjects);
  const projectsStatus = useAppSelector(selectProjectsStatus);

  // 1. Hydrate the user session once on mount
  useEffect(() => {
    dispatch(hydrateUserSession());
  }, [dispatch]);

  // 2. Once preferences and project status are available, sync current project
  useEffect(() => {
    if (!prefs?.prevProjectId) return;

    const syncProjectSelection = async () => {
      // 2a. If needed, fetch all projects
      if (projectsStatus === "idle") {
        await dispatch(fetchProjects()).unwrap();
      }

      // 2b. Find the project by ID after projects are available
      const selected = projects.find(
        (proj: Project) => proj.id === prefs.prevProjectId,
      );

      if (selected) {
        dispatch(setCurrentProject(selected));
        console.log("[useAuthSync] Synced current project:", selected);
      } else {
        console.warn(
          "[useAuthSync] Could not find project with ID:",
          prefs.prevProjectId,
        );
      }
    };

    syncProjectSelection();
  }, [prefs?.prevProjectId, projects, projectsStatus, dispatch]);
}
