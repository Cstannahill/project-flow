"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import clsx from "clsx";

export const diagramTypes = [
  {
    label: "Flowchart",
    value: "flowchart",
    snippet: `graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Do something]
  B -->|No| D[Do something else]`,
  },
  {
    label: "Sequence Diagram",
    value: "sequence",
    snippet: `sequenceDiagram
  participant A
  participant B
  A->>B: Hello B
  B-->>A: Hi A`,
  },
  {
    label: "Class Diagram",
    value: "class",
    snippet: `classDiagram
  Animal <|-- Duck
  Animal <|-- Fish
  class Animal {
    +String name
    +move()
  }`,
  },
  {
    label: "State Diagram",
    value: "state",
    snippet: `stateDiagram-v2
  [*] --> Idle
  Idle --> Loading
  Loading --> Complete
  Complete --> [*]`,
  },
  {
    label: "Gantt Chart",
    value: "gantt",
    snippet: `gantt
  dateFormat  YYYY-MM-DD
  title Sample Gantt
  section Development
  Setup       :done, 2024-01-01, 3d
  Feature X   :active, 2024-01-04, 5d
  QA          :2024-01-10, 3d`,
  },
  {
    label: "Architecture",
    value: "architecture-beta",
    snippet: `architecture-beta
    group api(cloud)[API]

    service db(database)[Database] in api
    service disk1(disk)[Storage] in api
    service disk2(disk)[Storage] in api
    service server(server)[Server] in api

    db:L -- R:server
    disk1:T -- B:server
    disk2:T -- B:db
    `,
  },
];

type Props = {
  initialContent?: string;
  initialType?: string;
  onSave: (data: { content: string; type: string }) => void;
};

export default function DiagramEditor({
  initialContent = "",
  initialType = "flowchart",
  onSave,
}: Props) {
  const [content, setContent] = useState(initialContent);
  const [type, setType] = useState(initialType);
  const [isPreview, setIsPreview] = useState(true);
  const [error, setError] = useState("");
  const renderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPreview) return;

    const renderDiagram = async () => {
      try {
        mermaid.initialize({ startOnLoad: false, theme: "dark" });

        const { svg } = await mermaid.render("diagram-preview", content);

        if (renderRef.current) {
          renderRef.current.innerHTML = svg;
        }

        setError("");
      } catch (err: any) {
        setError(err.message);
      }
    };

    renderDiagram();
  }, [content, isPreview]);

  const handleTypeChange = (value: string) => {
    setType(value);
    const template = diagramTypes.find((t) => t.value === value)?.snippet || "";
    setContent(template);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white dark:bg-neutral-900">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Diagram Editor</h2>
        <div className="flex items-center gap-3">
          <select
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="border rounded p-2 bg-transparent"
          >
            {diagramTypes.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsPreview((prev) => !prev)}
            className={clsx(
              "text-sm px-3 py-1 rounded border",
              isPreview
                ? "bg-gray-100 dark:bg-neutral-800"
                : "bg-blue-600 text-white"
            )}
          >
            {isPreview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {isPreview ? (
        <div
          ref={renderRef}
          className="border bg-white dark:bg-black p-4 rounded overflow-auto"
        />
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          className="w-full border p-2 rounded font-mono bg-transparent"
        />
      )}

      {error && <p className="text-sm text-red-500 italic">Error: {error}</p>}

      <div className="flex justify-end">
        <button
          onClick={() => onSave({ content, type })}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Diagram
        </button>
      </div>
    </div>
  );
}
