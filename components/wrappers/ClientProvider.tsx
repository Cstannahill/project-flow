"use client";

import React, { use, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { store } from "@/lib/store";
import { fetchProjects, setCurrentProject } from "@/lib/store/projects";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";
import NavigationWrapper from "./NavigationWrapper";
import { hydrateUserSession } from "@/lib/store/users/thunks";

function AuthSync() {
  const dispatch = useAppDispatch();
  const prefs = useAppSelector((s) => s?.user?.preferences);
  const projectsStatus = useAppSelector((s) => s?.project?.status);
  useEffect(() => {
    dispatch(hydrateUserSession());
  }, [dispatch]);
  useEffect(() => {
    if (prefs?.selectedProjectId) {
      // 2a) set the currentProjectId in your project slice
      dispatch(setCurrentProject(prefs.selectedProjectId));

      // 2b) trigger a fetchProjects() if you haven’t already
      //     (so that you have the projects list loaded before selecting)
      if (projectsStatus === "idle") {
        dispatch(fetchProjects());
      }
      // 2c) optionally, navigate there automatically
      // router.replace(`/projects/${prefs.selectedProjectId}/features`);
    }
  }, [prefs?.selectedProjectId, dispatch, projectsStatus]);
  return null;
}

export default function ClientProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const pathname = usePathname();
  const isSidebarRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/projects");

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Provider store={store}>
        <AuthSync />
        <NavigationWrapper>
          <SessionProvider session={session}>{children}</SessionProvider>
        </NavigationWrapper>
      </Provider>
    </NextThemesProvider>
  );
}
