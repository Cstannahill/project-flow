import type { Table, Column } from "@/types/entities/databases";
import SchemaTableAccordion from "@/components/databases/tables/SchemaTableAccordion";

interface Props {
  tables: Table[];
  onTableChange: (index: number, updated: Table) => void;
  onToggleGroup: (name: string) => void;
  expandedGroups: Record<string, boolean>;
  addColumn: (tableIndex: number) => void;
  updateColumn: (
    tableIndex: number,
    columnIndex: number,
    field: keyof Column,
    value: any,
  ) => void;
  removeColumn: (tableIndex: number, columnIndex: number) => void;
}

export default function SchemaTableList(props: Props) {
  return <SchemaTableAccordion {...props} />;
}
