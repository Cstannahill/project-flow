"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

type Props = {
  content: string;
  type?: string;
};

export default function DiagramViewer({ content }: Props) {
  const renderRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const render = async () => {
      try {
        mermaid.initialize({ startOnLoad: false, theme: "default" });
        const { svg } = await mermaid.render(`view-${Date.now()}`, content);
        if (renderRef.current) {
          renderRef.current.innerHTML = svg;
        }
        setError("");
      } catch (err: any) {
        setError(err.message);
      }
    };

    render();
  }, [content]);

  return (
    <div className="border bg-white dark:bg-black p-4 rounded overflow-auto">
      {error ? (
        <p className="text-red-500 text-sm italic">Error: {error}</p>
      ) : (
        <div ref={renderRef} />
      )}
    </div>
  );
}
