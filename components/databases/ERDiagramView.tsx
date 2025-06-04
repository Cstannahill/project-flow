"use client";
import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import type { SchemaData } from "@/types/entities/databases";
import { generateERDiagram } from "@/lib/erDiagram";

interface ERDiagramViewProps {
  schema: SchemaData;
}

// Initialize mermaid once with loose security so SVGs can include necessary attributes
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
});

export default function ERDiagramView({ schema }: ERDiagramViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [definition, setDefinition] = useState<string | null>(null);

  useEffect(() => {
    // Guard: need at least one table with a named column
    if (!schema?.tables?.length || !schema.tables[0]?.columns?.length) return;

    const generated = generateERDiagram(schema);
    setDefinition(generated);
  }, [schema]);

  useEffect(() => {
    if (!definition || !containerRef.current) return;
    try {
      mermaid.parse(definition);
      const id = `er-diagram-${Math.random().toString(36).slice(2)}`;
      mermaid.render(id, definition).then(({ svg }) => {
        containerRef.current!.innerHTML = svg;
      });
    } catch (err) {
      console.error("Mermaid render error:", err, definition);
    }
  }, [definition]);

  return (
    <div className="border-brand-accent text-brand-text-secondary bg-brand-background rounded-md border p-4 text-sm">
      <h3 className="text-brand-text-secondary mb-2 text-lg font-semibold">
        Entity Relationship Diagram
      </h3>
      <div
        ref={containerRef}
        className="overflow-auto rounded bg-white p-2 dark:bg-neutral-900"
      />
      <div className="border-border mt-4 rounded border border-dashed bg-[--brand-background] p-3 text-xs">
        <p className="mb-1 font-semibold text-[--brand-text-primary]">Legend</p>
        <ul className="space-y-1">
          <li>
            <code>{"||--||"}</code> → One-to-One
          </li>
          <li>
            <code>{"||--o("}</code> → One-to-Many
          </li>
          <li>
            <code>{"o{--||"}</code> → Many-to-One
          </li>
          <li>
            <code>{"o{--o{"}</code> → Many-to-Many
          </li>
          <li>
            <code>PK</code> = Primary Key, <code>UK</code> = Unique,{" "}
            <code>NULL</code> = Nullable
          </li>
          {schema.relationships?.length ? (
            <>
              <li className="pt-2 font-semibold text-[--brand-text-primary]">
                Relationships
              </li>
              {schema.relationships.map((r, idx) => (
                <li key={idx} className="ml-2">
                  <code>
                    {r.fromTable}.{r.fromColumn} → {r.toTable}.{r.toColumn}
                  </code>
                </li>
              ))}
            </>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
