"use client";

import mermaid from "mermaid";
import { useEffect } from "react";

export default function DiagramsTab() {
  const chart = `
    graph TD
    A[Login Page] --> B[Dashboard]
    B --> C[Feature List]
    C --> D[Diagrams]
  `;

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true, theme: "dark" });
    mermaid.contentLoaded();
  }, [chart]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Project Diagram</h2>
      <div className="bg-white border p-4 rounded shadow">
        <div className="mermaid">{chart}</div>
      </div>
    </div>
  );
}
