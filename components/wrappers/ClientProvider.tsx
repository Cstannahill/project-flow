"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";
import NavigationWrapper from "./NavigationWrapper";
import { useAuthSync } from "@/hooks/useAuthSync";
import { ReduxHydrationSync } from "../utility/ReduxHydrationSync";

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
        <ReduxHydrationSync />
        <NavigationWrapper>
          <SessionProvider session={session}>{children}</SessionProvider>
        </NavigationWrapper>
      </Provider>
    </NextThemesProvider>
  );
}
