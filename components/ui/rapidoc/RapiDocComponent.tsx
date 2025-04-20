"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// dynamically import the Web‑Component **client‑side only**
const Rapidoc = dynamic(
  async () => {
    await import("rapidoc"); // registers <rapi-doc>
    return (props: any) => <rapi-doc {...props} />;
  },
  { ssr: false }
);

export default function RapiDocComponent({ specUrl }: { specUrl: string }) {
  return (
    <Rapidoc
      spec-url={specUrl}
      theme="light"
      renderStyle="read"
      allowTry
      style={{ width: "100%", height: "90vh" }}
    />
  );
}
