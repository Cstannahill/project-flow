import { Table, Column, type SchemaData } from "@/types/entities/databases";
import safeStringify from "fast-safe-stringify";

export function exportSchema(
  SchemaData: SchemaData,
  format: "sql" | "prisma" | "dbml" | "json",
): string {
  switch (format) {
    case "sql":
      return SchemaData.tables
        .map(({ name, columns }) => {
          const cols = columns
            .map((col) => {
              const parts = [col.name, col.type];
              if (col.isPrimary) parts.push("PRIMARY KEY");
              if (!col.isNullable) parts.push("NOT NULL");
              if (col.isUnique) parts.push("UNIQUE");
              return "  " + parts.join(" ");
            })
            .join(",\n");
          return `CREATE TABLE ${name} (\n${cols}\n);`;
        })
        .join("\n\n");

    case "prisma":
      return SchemaData.tables
        .map(({ name, columns }) => {
          const cols = columns
            .map((col) => {
              const base = `${col.name} ${toPrismaType(col.type)}${
                col.isNullable ? "?" : ""
              }`;
              const attrs = [];
              if (col.isPrimary) attrs.push("@id");
              if (col.isUnique) attrs.push("@unique");
              return `  ${base} ${attrs.join(" ")}`.trim();
            })
            .join("\n");
          return `model ${name} {\n${cols}\n}`;
        })
        .join("\n\n");

    case "dbml":
      return SchemaData.tables
        .map(({ name, columns }) => {
          const cols = columns
            .map((col) => {
              const attrs = [];
              if (col.isPrimary) attrs.push("pk");
              if (!col.isNullable) attrs.push("not null");
              if (col.isUnique) attrs.push("unique");
              return `  ${col.name} ${col.type} ${attrs.join(" ")}`.trim();
            })
            .join("\n");
          return `Table ${name} {\n${cols}\n}`;
        })
        .join("\n\n");

    case "json":
    default:
      return JSON.stringify(SchemaData.tables, null, 2);
  }
}

function toPrismaType(sqlType: string): string {
  const map: Record<string, string> = {
    VARCHAR: "String",
    INT: "Int",
    BOOLEAN: "Boolean",
    TIMESTAMP: "DateTime",
    FLOAT: "Float",
    DECIMAL: "Decimal",
    BIGINT: "BigInt",
    BLOB: "Bytes",
  };
  return map[sqlType.toUpperCase()] || "String";
}
