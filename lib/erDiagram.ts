import type { SchemaData, RelationshipType } from "@/types/base";

export function generateERDiagram({
  tables,
  relationships,
}: SchemaData): string {
  let diagram = `erDiagram\n`;

  for (const table of tables) {
    diagram += `  ${table.name} {\n`;

    for (const col of table.columns) {
      let flags = [];

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

  return diagram;
}
