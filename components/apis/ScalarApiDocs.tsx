// components/ApiDocs.tsx
"use client";

import { RedocStandalone } from "redoc";

interface ApiDocsProps {
  specUrl: string;
  theme?: "light" | "dark";
}

export function ScalarApiDocs({ specUrl, theme = "light" }: ApiDocsProps) {
  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <RedocStandalone
        specUrl={specUrl}
        options={{
          theme: {
            colors: {
              primary: {
                main: theme === "dark" ? "#ffffff" : "#000000",
              },
            },
          },
          nativeScrollbars: false,
          scrollYOffset: 0,
        }}
      />
    </div>
  );
}
