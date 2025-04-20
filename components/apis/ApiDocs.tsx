"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const LoadWC = dynamic(
  () =>
    import("@stoplight/elements/web-components.min.js").then(() => () => null),
  { ssr: false }
);

export function ApiDocs({ specUrl }: { specUrl: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      (ref.current as any).apiDescriptionUrl = specUrl;
    }
  }, [specUrl]);

  return (
    <>
      <LoadWC />
      <elements-api
        ref={ref}
        router="hash"
        layout="sidebar"
        style={{ width: "100%", height: "90vh" }}
      />
    </>
  );
}
