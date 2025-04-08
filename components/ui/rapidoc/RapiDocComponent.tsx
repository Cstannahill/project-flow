// components/api/RapiDocComponent.tsx
"use client";

import { useEffect, useRef } from "react";
import "rapidoc";

type Props = {
  specUrl: string;
};

export default function RapiDocComponent({ specUrl }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.setAttribute("spec-url", specUrl);
    }
  }, [specUrl]);

  return (
    <rapi-doc
      ref={ref}
      theme="light"
      renderStyle="read"
      show-header={false}
      allowTry={true}
      style={{ width: "100%", height: "90vh" }}
    />
  );
}
