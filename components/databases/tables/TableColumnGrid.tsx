"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import type { Column } from "@/types/entities/databases";
import { TrashIcon } from "@heroicons/react/24/solid";
import { memo, useMemo } from "react";

interface Props {
  columns: Column[];
  tableIndex: number;
  updateColumn: (
    ti: number,
    ci: number,
    field: keyof Column,
    value: any,
  ) => void;
  removeColumn: (ti: number, ci: number) => void;
}

const TableColumnGrid = ({
  columns = [],
  tableIndex,
  updateColumn,
  removeColumn,
}: Props) => {
  const columnDefs = useMemo<ColumnDef<Column>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: ({ row, getValue }) => (
          <input
            className="border-accent rounded border border-neutral-700/80 bg-neutral-900 px-1 text-foreground"
            defaultValue={getValue<string>()}
            onBlur={(e) =>
              updateColumn(tableIndex, row.index, "name", e.target.value)
            }
          />
        ),
      },
      {
        header: "Type",
        accessorKey: "type",
        cell: ({ row, getValue }) => (
          <select
            className="rounded border border-zinc-700 bg-surface px-1 text-foreground"
            defaultValue={getValue<string>()}
            onBlur={(e) =>
              updateColumn(tableIndex, row.index, "type", e.target.value)
            }
          >
            {["VARCHAR", "TEXT", "INT", "BOOLEAN", "DATE", "UUID"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        ),
      },
      {
        header: "PK",
        accessorKey: "isPrimary",
        cell: ({ row, getValue }) => (
          <input
            type="checkbox"
            className="accent-brand-"
            defaultChecked={getValue<boolean>()}
            onChange={(e) =>
              updateColumn(tableIndex, row.index, "isPrimary", e.target.checked)
            }
          />
        ),
      },
      {
        header: "NULL",
        accessorKey: "isNullable",
        cell: ({ row, getValue }) => (
          <input
            type="checkbox"
            defaultChecked={getValue<boolean>()}
            onChange={(e) =>
              updateColumn(
                tableIndex,
                row.index,
                "isNullable",
                e.target.checked,
              )
            }
          />
        ),
      },
      {
        header: "FK",
        accessorKey: "isUnique",
        cell: ({ row, getValue }) => (
          <input
            type="checkbox"
            defaultChecked={getValue<boolean>()}
            onChange={(e) =>
              updateColumn(tableIndex, row.index, "isUnique", e.target.checked)
            }
          />
        ),
      },
      {
        header: "",
        id: "actions",
        cell: ({ row }) => (
          <button onClick={() => removeColumn(tableIndex, row.index)}>
            <TrashIcon className="h-4 w-4 text-red-500" />
          </button>
        ),
      },
    ],
    [tableIndex, updateColumn, removeColumn],
  );

  const table = useReactTable({
    data: Array.isArray(columns) ? columns : [],
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded border border-zinc-700 bg-surface">
      <table className="w-full text-sm">
        <thead className="text-accent border-accent border-b text-left">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id} className="px-2 py-1">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b border-zinc-800">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-2 py-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(TableColumnGrid);
