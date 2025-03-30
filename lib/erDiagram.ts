import mermaid from "mermaid";
import { Table } from "@/types/base";

export function generateERDiagram(tables: Table[]): string {
  return `erDiagram
${tables
  .map(
    (t) =>
      `  ${t.name} {
${t.columns.map((c) => `   ${c.name} ${c.type} `).join("\n")}
  }`
  )
  .join("\n")}`;
}
