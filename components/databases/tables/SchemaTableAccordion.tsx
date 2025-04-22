"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Table, Column } from "@/types/entities/databases";
import TableColumnGrid from "./TableColumnGrid";
import { useMemo, useState, memo } from "react";
import { H4 } from "@/components/ui/Typography";

type Props = {
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
};

function SchemaTableAccordion({
  tables,
  onTableChange,
  expandedGroups,
  addColumn,
  updateColumn,
  removeColumn,
}: Props) {
  const [openTables, setOpenTables] = useState<string[]>(() =>
    Object.entries(expandedGroups)
      .filter(([_, isOpen]) => isOpen)
      .map(([name]) => name),
  );

  // Precompute stable columns arrays for each table
  const stableColumnsList = useMemo(
    () => tables.map((table) => table.columns ?? []),
    [tables],
  );

  const handleTableNameChange =
    (ti: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const updated = { ...tables[ti], name: e.target.value };
      onTableChange(ti, updated);
    };

  return (
    <Accordion
      type="multiple"
      value={openTables}
      onValueChange={(vals) => setOpenTables(vals)}
    >
      {tables.map((table, ti) => {
        const columns = stableColumnsList[ti];

        return (
          <AccordionItem key={`table-${table.id}`} value={table.name}>
            <AccordionTrigger className="mb-1 rounded border bg-vsdark px-2 py-1 text-left text-base font-semibold text-accent-secondary hover:cursor-pointer">
              <H4 className="text-accent">{table.name || `Table${ti + 1}`}</H4>
            </AccordionTrigger>

            <AccordionContent className="space-y-4 rounded border bg-zinc-800 px-4 py-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Table Name:</label>
                <input
                  defaultValue={table.name}
                  onBlur={(e) =>
                    onTableChange(ti, { ...table, name: e.target.value })
                  }
                  className="database-card-input w-full max-w-xs rounded border border-slate-600 bg-[#0b0b09] bg-zinc-900 px-2 py-1"
                />
              </div>

              <TableColumnGrid
                columns={columns}
                tableIndex={ti}
                updateColumn={updateColumn}
                removeColumn={removeColumn}
              />
              <button
                onClick={() => addColumn(ti)}
                className="text-accent mt-2 text-sm hover:underline"
              >
                + Add Column
              </button>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default memo(SchemaTableAccordion);
