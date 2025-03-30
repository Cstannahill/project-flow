"use client";

import React, { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { useAppDispatch } from "@/lib/store/hooks";
import { store } from "@/lib/store/store";
import { login } from "@/lib/store/userSlice";
import Navbar from "../ui/Navbar";
import { useTheme } from "next-themes";
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { ThemeProvider as NextThemeProvider } from "next-themes";

const lightTheme = createTheme({ palette: { mode: "light" } });
const darkTheme = createTheme({ palette: { mode: "dark" } });

function AuthSync({ session }: { session: any }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session?.user) {
      dispatch(
        login({
          name: session.user.name || "",
          email: session.user.email || "",
        })
      );
    }
  }, [session, dispatch]);

  return null;
}

function MuiSyncThemeWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? darkTheme : lightTheme;

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

export default function ClientProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MuiSyncThemeWrapper>
        <Provider store={store}>
          <AuthSync session={session} />
          <Navbar layout="top" />
          <SessionProvider session={session}>{children}</SessionProvider>
        </Provider>
      </MuiSyncThemeWrapper>
    </NextThemeProvider>
  );
}
