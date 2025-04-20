import type {
  SchemaData,
  Table,
  Column,
  Relationship,
  RelationshipType,
} from "@/types/entities/databases";

interface ERDiagramOptions {
  /** Mermaid frontmatter theme (default: dark) */
  theme?: string;
  /** Title shown in frontmatter */
  title?: string;
}

/**
 * Replace any non‑word characters with underscore,
 * so Mermaid identifiers never break.
 */
function sanitizeId(raw: string): string {
  return raw.trim().replace(/[^\w]/g, "_");
}

/**
 * Turn a single Column into its ERD line:
 *    name TYPE "PK,UK"
 */
function formatColumn(col: Column): string {
  const name = sanitizeId(col.name);
  const type = sanitizeId(col.type);
  const flags = [
    col.isPrimary ? "PK" : null,
    col.isUnique ? "UK" : null,
    col.isNullable ? "NULL" : null,
  ].filter(Boolean);

  return flags.length
    ? `${name} ${type} "${flags.join(",")}"`
    : `${name} ${type}`;
}

/** Map our RelationshipType to Mermaid arrow syntax */
function arrowFor(rel: RelationshipType): string {
  switch (rel) {
    case "OneToOne":
      return "||--||";
    case "OneToMany":
      return "||--o{";
    case "ManyToOne":
      return "}o--||";
    case "ManyToMany":
      return "}o--o{";
    default:
      console.warn(`Unknown relationship type: ${rel}`);
      return "--";
  }
}

/**
 * Main generator. Returns full Mermaid ER diagram (with YAML frontmatter).
 */
export function generateERDiagram(
  schema: SchemaData,
  opts: ERDiagramOptions = {}
): string {
  const theme = opts.theme ?? "dark";
  const title = opts.title ?? "Entity Relationship Diagram";

  // Build frontmatter once
  const frontmatter = [
    `---`,
    `title: "${title.replace(/"/g, '\\"')}"`,
    `config:`,
    `  theme: "${theme}"`,
    `---`,
    ``,
  ];

  // Gather lines
  const lines: string[] = ["erDiagram"];

  // -- Tables
  for (const tbl of schema.tables ?? []) {
    if (!tbl.name || !Array.isArray(tbl.columns)) continue;
    const tableId = sanitizeId(tbl.name);
    lines.push(`  ${tableId} {`);
    for (const col of tbl.columns) {
      if (!col.name || !col.type) continue;
      lines.push(`    ${formatColumn(col)}`);
    }
    lines.push(`  }`);
  }

  // -- Relationships
  for (const rel of schema.relationships ?? []) {
    if (!rel.fromTable || !rel.toTable) continue;
    const from = sanitizeId(rel.fromTable);
    const to = sanitizeId(rel.toTable);
    const arrow = arrowFor(rel.type as RelationshipType);
    let label = "";
    if (rel.fromColumn && rel.toColumn) {
      // escape any quotes
      const left = sanitizeId(rel.fromColumn);
      const right = sanitizeId(rel.toColumn);
      label = ` : "${left}→${right}"`;
    }
    lines.push(`  ${from} ${arrow} ${to}${label}`);
  }

  return [...frontmatter, ...lines].join("\n");
}
