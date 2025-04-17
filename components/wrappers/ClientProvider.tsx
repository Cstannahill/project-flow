"use client";

import React, { use, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { store } from "@/lib/store/store";
import { login } from "@/lib/store/userSlice";
import NavbarWrapper from "@/components/ui/NavbarWrapper";
import { useTheme } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";
import NavigationWrapper from "./NavigationWrapper";
import { hydrateUserSession } from "@/lib/store/userThunks";
import { setCurrentProject } from "@/lib/store/projectThunks";

function AuthSync({ session }: { session: any }) {
  const dispatch = useAppDispatch();
  const userProj = useAppSelector(
    (state) => state?.user?.currentUser?.selectedProjectId
  );
  useEffect(() => {
    dispatch(hydrateUserSession(session));
  }, [session, dispatch]);

  useEffect(() => {
    if (session) {
      // dispatch(setCurrentProject(userProj));
    }
  }, [userProj, session, dispatch]);

  return null;
}

function NextThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

export default function ClientProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();

  const isSidebarRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/projects");

  return (
    <NextThemeProviderWrapper>
      <Provider store={store}>
        <AuthSync session={session} />
        <NavigationWrapper>
          <SessionProvider session={session}>{children}</SessionProvider>
        </NavigationWrapper>
      </Provider>
    </NextThemeProviderWrapper>
  );
}
