import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import type { SchemaData } from "@/types/entities/databases";

interface ERDiagramViewProps {
  schema: SchemaData;
}

// Initialize mermaid once with loose security so SVGs can include necessary attributes
mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
});

/**
 * Sanitizes an identifier for mermaid: replaces non-word characters,
 * prefixes with _ if it starts with a digit.
 */
function sanitizeId(str: string = ""): string {
  let s = str.replace(/[^A-Za-z0-9_]/g, "_");
  if (/^[0-9]/.test(s)) s = `_${s}`;
  return s;
}

export default function ERDiagramView({ schema }: ERDiagramViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Guard: need at least one table with a named column
    if (!schema?.tables?.length) return;
    const first = schema.tables?.[0];
    if (!first?.columns?.length || first.columns?.[0]?.name === "") return;

    // Build ER diagram definition
    let definition = `erDiagram\n`;
    try {
      // Tables
      schema?.tables?.forEach((table) => {
        const tableId = sanitizeId(table?.name);
        definition += `  ${tableId} as \"${table?.name}\" {\n`;
        table?.columns?.forEach((col) => {
          const colName = sanitizeId(col?.name);
          const flags: string[] = [];
          if (col?.isPrimary) flags.push("PK");
          if (col?.isUnique) flags.push("UK");
          if (col?.isNullable) flags.push("NULL");
          definition += `    ${colName} ${col?.type}${
            flags.length ? ` \"${flags.join(", ")}\"` : ""
          }\n`;
        });
        definition += `  }\n`;
      });
      // Relationships
      schema?.relationships?.forEach((rel) => {
        const arrowMap: Record<string, string> = {
          OneToOne: "||--||",
          OneToMany: "||--o{",
          ManyToOne: "o{--||",
          ManyToMany: "o{--o{",
        };
        const arrow = arrowMap[rel?.type as string] || "||--||";
        const src = sanitizeId(rel?.source);
        const tgt = sanitizeId(rel?.target);
        definition += `  ${src} ${arrow} ${tgt}\n`;
      });
    } catch (err) {
      console.error("Error generating ER definition:", err);
      return;
    }

    // Render via mermaid
    const container = containerRef.current;
    if (container) {
      try {
        mermaid.parse(definition);
        const id = `er-diagram-${Math.random().toString(36).slice(2)}`;
        mermaid
          .render(id, definition)
          .then(({ svg }) => {
            container.innerHTML = svg;
          })
          .catch((err) => {
            console.error("Mermaid render error:", err, definition);
          });
      } catch (err) {
        console.error("Mermaid parse error:", err, definition);
      }
    }
  }, [schema]);

  return (
    <div
      ref={containerRef}
      className="border rounded p-4 bg-white dark:bg-neutral-900 overflow-auto"
    />
  );
}
