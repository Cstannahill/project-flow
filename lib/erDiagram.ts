// lib/erDiagram.ts
import type { SchemaData } from "@/types/entities/databases";

function sanitizeId(str: string = ""): string {
  let s = str.replace(/[^A-Za-z0-9_]/g, "_");
  if (/^[0-9]/.test(s)) s = `_${s}`;
  return s;
}

/**
 * Generates a Mermaid ER diagram definition from schema data.
 */
export function generateERDiagram(schema: SchemaData): string {
  let diagram = `erDiagram\n`;

  // Tables
  for (const table of schema.tables) {
    const tableId = sanitizeId(table.name);
    diagram += `  ${tableId} as \"${table.name}\" {\n`;

    for (const col of table.columns) {
      const colId = sanitizeId(col.name);
      const flags = [];
      if (col.isPrimary) flags.push("PK");
      if (col.isUnique) flags.push("UK");
      if (col.isNullable) flags.push("NULL");
      diagram += `    ${colId} ${col.type}${
        flags.length ? ` \"${flags.join(", ")}\"` : ""
      }\n`;
    }

    diagram += `  }\n`;
  }

  // Relationships
  const arrowMap: Record<string, string> = {
    OneToOne: "||--||",
    OneToMany: "||--o{",
    ManyToOne: "o{--||",
    ManyToMany: "o{--o{",
  };

  for (const rel of schema.relationships) {
    const from = sanitizeId(rel.fromTable);
    const to = sanitizeId(rel.toTable);
    const arrow = arrowMap[rel.type] || "||--||";
    const label = `${rel.fromColumn} → ${rel.toColumn}`;
    diagram += `  ${from} ${arrow} ${to} : \"${label}\"\n`;
  }

  // Legend block
  diagram += `\n  %% Legend\n`;
  diagram += `  %% ||--||  One to One\n`;
  diagram += `  %% ||--o{  One to Many\n`;
  diagram += `  %% o{--||  Many to One\n`;
  diagram += `  %% o{--o{  Many to Many\n`;
  diagram += `  %% PK = Primary Key, UK = Unique, NULL = Nullable\n`;

  return diagram;
}
