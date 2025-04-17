import type { SchemaData, RelationshipType } from "@/types/base";

export function generateERDiagram({
  tables,
  relationships,
}: SchemaData): string {
  let diagram = `erDiagram\n`;
  const frontmatter = `---
title: "Entity Relationship Diagram"
description: "Auto-generated ER diagram based on schema"
config:
  theme: "dark"
---\n\n`;
  for (const table of tables) {
    diagram += `  ${table.name} {\n`;

    for (const col of table.columns) {
      const flags = [];

      if (col.isPrimary) flags.push("PK");
      if (col.isUnique) flags.push("UK");
      if (col.isNullable) flags.push("NULL");

      diagram += `   ${col.name} ${col.type}${
        flags.length ? ` "${flags.join(", ")}"` : ""
      }\n`;
    }

    diagram += `  }\n`;
  }

  for (const rel of relationships) {
    const arrow = (() => {
      switch (rel.type as RelationshipType) {
        case "OneToOne":
          return "||--||";
        case "OneToMany":
          return "||--o{";
        case "ManyToOne":
          return "}o--||";
        case "ManyToMany":
          return "}o--o{";
        default:
          return "--";
      }
    })();
    diagram += `  ${rel.fromTable} ${arrow} ${rel.toTable} : "${rel.fromColumn} → ${rel.toColumn}"\n`;
  }

  return frontmatter + diagram;
}
