// components/ScalarApiDocs.tsx
"use client";

// Pull in the styles scoped to this component
import "@scalar/api-reference/dist/style.css";

import dynamic from "next/dynamic";

// Dynamically register the web component on the client only
const LoadScalar = dynamic(
  () => import("@scalar/api-reference").then(() => () => null),
  { ssr: false },
);

interface ScalarApiDocsProps {
  specUrl: string;
  proxyUrl?: string;
  theme?: string;
}

export function ScalarApiDocs({
  specUrl,
  proxyUrl = "https://proxy.scalar.com",
  theme = "default",
}: ScalarApiDocsProps) {
  return (
    <>
      <LoadScalar />
      <api-reference
        data-url={specUrl}
        data-proxy-url={proxyUrl}
        data-configuration={JSON.stringify({ theme })}
        style={{ width: "100%", height: "90vh" }}
      />
    </>
  );
}
