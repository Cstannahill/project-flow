import { Table } from "@/types/base";

export function parseSQLSchema(sql: string): Table[] {
  const tables: Table[] = [];
  const regex = /CREATE TABLE (\w+) \((.*?)\);/gs;

  let match;
  while ((match = regex.exec(sql)) !== null) {
    const [, tableName, columnsBlock] = match;
    const columns: any[] = [];

    const lines = columnsBlock.split(",").map((line) => line.trim());
    for (let line of lines) {
      const parts = line.split(/\s+/);
      const name = parts[0];
      const type = parts[1]?.toUpperCase() || "VARCHAR";

      columns.push({
        name,
        type,
        isPrimary: /PRIMARY KEY/i.test(line),
        isNullable: !/NOT NULL/i.test(line),
        isUnique: /UNIQUE/i.test(line),
      });
    }

    tables.push({ name: tableName, columns });
  }

  return tables;
}

export function parsePrismaSchema(prisma: string): Table[] {
  const modelRegex = /model (\w+) {([\s\S]*?)}/g;
  const tables: Table[] = [];
  let match;

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

  while ((match = modelRegex.exec(prisma)) !== null) {
    const [, modelName, block] = match;
    const lines = block
      .trim()
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("//") && !l.startsWith("@@"));

    const columns = lines
      .map((line) => {
        const cleanedLine = line.replace(/@[^\s]+/g, "").trim(); // remove all @decorators
        const [name, rawType] = cleanedLine.split(/\s+/);
        if (!name || !rawType) return null;

        const baseType = rawType.replace(/\?|\[\]/g, "");
        return {
          name,
          type: typeMap[baseType] || "VARCHAR",
          isPrimary: line.includes("@id"),
          isUnique: line.includes("@unique"),
          isNullable: rawType.includes("?"),
        };
      })
      .filter(Boolean) as {
      name: string;
      type: string;
      isPrimary?: boolean;
      isUnique?: boolean;
      isNullable?: boolean;
    }[];

    tables.push({ name: modelName, columns });
  }

  return tables;
}
