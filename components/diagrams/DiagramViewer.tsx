"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import matter from "gray-matter";

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
        mermaid.initialize({ startOnLoad: true, theme: "dark" });
        const { svg } = await mermaid.render(`view-${Date.now()}`, content);
        const { data } = matter(svg);
        console.log("data", data);
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
    <div className="border bg-white dark:bg-black text-black p-4 rounded overflow-auto">
      {error ? (
        <p className="text-red-500 text-sm italic">Error: {error}</p>
      ) : (
        <div ref={renderRef} />
      )}
    </div>
  );
}
