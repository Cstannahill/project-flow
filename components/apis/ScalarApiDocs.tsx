// components/ScalarApiDocs.tsx
"use client";

// 1) pull in the styles so they scope only to the component
// import "@scalar/api-reference/style.css";
// 2) register the custom element
import "@scalar/api-reference";

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
  console.log(specUrl);
  return (
    <api-reference
      data-url={specUrl}
      data-proxy-url={proxyUrl}
      data-configuration={JSON.stringify({ theme })}
      style={{ width: "100%", height: "90vh" }}
    />
  );
}
