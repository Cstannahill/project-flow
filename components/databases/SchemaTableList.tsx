import SchemaTable from "./SchemaTable";
import type { Table, Column } from "@/types/entities/databases";

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
    value: any
  ) => void;
  removeColumn: (tableIndex: number, columnIndex: number) => void;
}

export default function SchemaTableList(props: Props) {
  return props.tables.map((table, index) => (
    <SchemaTable
      key={table.id}
      table={table}
      index={index}
      isExpanded={props.expandedGroups[table.name]}
      onTableChange={props.onTableChange}
      onToggleGroup={props.onToggleGroup}
      addColumn={props.addColumn}
      updateColumn={props.updateColumn}
      removeColumn={props.removeColumn}
    />
  ));
}
