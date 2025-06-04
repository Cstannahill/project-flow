import {
  Table,
  type Column,
  Relationship,
  SchemaData,
} from "@/types/entities/databases";

export function parseSQLSchema(sql: string): SchemaData {
  const tables: Table[] = [];
  const relationships: Relationship[] = [];

  const createTableRegex = /CREATE TABLE\s+["`]?(\w+)["`]?\s*\(([\s\S]*?)\);/gi;
  const foreignKeyRegex =
    /FOREIGN KEY\s*\((\w+)\)\s*REFERENCES\s+(\w+)\s*\((\w+)\)/i;

  let match;
  while ((match = createTableRegex.exec(sql)) !== null) {
    const [, tableName, rawColumns] = match;
    const columns: Column[] = [];

    const lines = rawColumns
      .split(",")
      .map((line) => line.trim())
      .filter(Boolean);

    lines.forEach((line) => {
      const fkMatch = line.match(foreignKeyRegex);
      if (fkMatch) {
        const [, fromColumn, toTable, toColumn] = fkMatch;
        relationships.push({
          fromTable: tableName,
          toTable,
          fromColumn,
          toColumn,
          source: tableName,
          target: toTable,
          type: "OneToMany",
        });
        return;
      }

      const colMatch = line.match(/^["`]?(\w+)["`]?\s+(\w+)/);
      if (colMatch) {
        const [, name, type] = colMatch;
        columns.push({
          name,
          type: type.toUpperCase(),
          isPrimary: line.toLowerCase().includes("primary key"),
          isNullable: !line.toLowerCase().includes("not null"),
          isUnique: line.toLowerCase().includes("unique"),
        });
      }
    });

    tables.push({ name: tableName, columns });
  }

  return { tables, relationships };
}

export function parsePrismaSchema(prisma: string): SchemaData {
  const modelRegex = /model (\w+) {([\s\S]*?)}/g;
  const tables: Table[] = [];
  const relationships: Relationship[] = [];
  const typeMap: Record<string, string> = {
    String: "VARCHAR",
    Int: "INT",
    Boolean: "BOOLEAN",
    DateTime: "TIMESTAMP",
    Float: "FLOAT",
    Decimal: "DECIMAL",
    BigInt: "BIGINT",
    Bytes: "BLOB",
  };

  let match;
  while ((match = modelRegex.exec(prisma)) !== null) {
    const [, modelName, block] = match;
    const lines = block
      .trim()
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("//") && !l.startsWith("@@"));

    const columns: Column[] = [];

    lines.forEach((line) => {
      const relationMatch = line.match(/^(\w+)\s+(\w+)\s+@relation\((.*?)\)/);
      if (relationMatch) {
        const [, fieldName, referencedModel, relationArgs] = relationMatch;

        const fieldsMatch = relationArgs.match(/fields:\s*\[(\w+)\]/);
        const referencesMatch = relationArgs.match(/references:\s*\[(\w+)\]/);

        if (fieldsMatch && referencesMatch) {
          const fromColumn = fieldsMatch[1];
          const toColumn = referencesMatch[1];

          relationships.push({
            fromTable: modelName,
            toTable: referencedModel,
            fromColumn,
            toColumn,
            source: modelName,
            target: referencedModel,
            type: "OneToMany",
          });
        }
        return;
      }

      const cleanedLine = line.replace(/@[^\s]+/g, "").trim();
      const [name, rawType] = cleanedLine.split(/\s+/);
      if (!name || !rawType) return;

      const baseType = rawType.replace(/\?|\[\]/g, "");
      columns.push({
        name,
        type: typeMap[baseType] || "VARCHAR",
        isPrimary: line.includes("@id"),
        isUnique: line.includes("@unique"),
        isNullable: rawType.includes("?"),
      });
    });

    tables.push({ name: modelName, columns });
  }

  return { tables, relationships };
}

export function parseDbmlSchema(dbml: string): SchemaData {
  const tables: Table[] = [];
  const relationships: Relationship[] = [];

  const tableRegex = /Table\s+(\w+)\s*{([\s\S]*?)}/g;
  const refRegex = /Ref:\s+(\w+)\.(\w+)\s*>\s*(\w+)\.(\w+)/g;

  let match;
  while ((match = tableRegex.exec(dbml)) !== null) {
    const [, tableName, block] = match;
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const columns: Column[] = lines.map((line) => {
      const [name, typeRaw, ...rest] = line.split(/\s+/);
      const type = typeRaw.toUpperCase();
      return {
        name,
        type,
        isPrimary: rest.join(" ").includes("[pk]"),
        isNullable: !rest.join(" ").includes("not null"),
        isUnique: rest.join(" ").includes("[unique]"),
      };
    });

    tables.push({ name: tableName, columns });
  }

  while ((match = refRegex.exec(dbml)) !== null) {
    const [, fromTable, fromColumn, toTable, toColumn] = match;
    relationships.push({
      fromTable,
      toTable,
      fromColumn,
      toColumn,
      source: fromTable,
      target: toTable,
      type: "OneToMany",
    });
  }

  return { tables, relationships };
}

export function parseJsonSchema(json: string): SchemaData {
  try {
    const parsed = JSON.parse(json);

    if (!Array.isArray(parsed.tables)) throw new Error("Missing tables array");

    return {
      tables: parsed.tables,
      relationships: parsed.relationships || [],
    };
  } catch (e) {
    throw new Error("Invalid JSON schema");
  }
}

export async function parseUploadedSchema(file: File): Promise<SchemaData> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const text = await file.text();

  if (!extension) throw new Error("Unknown file type");

  switch (extension) {
    case "sql":
      return parseSQLSchema(text);
    case "prisma":
      return parsePrismaSchema(text);
    case "dbml":
      return parseDbmlSchema(text);
    case "json":
      return parseJsonSchema(text);
    default:
      throw new Error("Unsupported file type");
  }
}
