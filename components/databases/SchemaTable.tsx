import { TrashIcon } from "@heroicons/react/24/solid";
import type { Table, Column } from "@/types/entities/databases";
import { sqlTypes } from "@/lib/staticAssets";

interface Props {
  table: Table;
  index: number;
  onTableChange: (index: number, updated: Table) => void;
  onToggleGroup: (name: string) => void;
  isExpanded: boolean;
  addColumn: (tableIndex: number) => void;
  updateColumn: (
    ti: number,
    ci: number,
    field: keyof Column,
    value: any,
  ) => void;
  removeColumn: (ti: number, ci: number) => void;
}

export default function SchemaTable(props: Props) {
  const { table, index, isExpanded } = props;

  return (
    <>
      <div className="mt-4 flex flex-col gap-2 rounded border border-slate-500/80 bg-zinc-800">
        <button
          className="align-center float-start mt-2 flex"
          onClick={() => props.onToggleGroup(table.name)}
        >
          {isExpanded ? "▾" : "▸"}
        </button>
      </div>

      <div className="mt-0 rounded border bg-zinc-700 p-4">
        <div className="flex items-center gap-3 text-accent">
          <input
            type="text"
            value={table.name}
            onChange={(e) =>
              props.onTableChange(index, { ...table, name: e.target.value })
            }
            className="database-card-input w-full border border-slate-500/80 font-semibold"
          />
        </div>

        {isExpanded && (
          <>
            <table className="w-full text-sm">
              <tbody>
                {table.columns.map((col, ci) => (
                  <tr key={ci}>
                    <td>
                      <input
                        className="database-card-input"
                        value={col.name}
                        onChange={(e) =>
                          props.updateColumn(index, ci, "name", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={col.type}
                        onChange={(e) =>
                          props.updateColumn(index, ci, "type", e.target.value)
                        }
                      >
                        {sqlTypes.map((t: any) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </td>
                    <td className="text-center align-middle">
                      <div className="flex h-full flex-col justify-center justify-items-center gap-1 text-center">
                        <label className="mx-auto flex text-center text-sm text-gray-400">
                          PK
                        </label>
                        <input
                          className="database-card-input flex-row"
                          type="checkbox"
                          checked={col.isPrimary}
                          onChange={(e) =>
                            props.updateColumn(
                              index,
                              ci,
                              "isPrimary",
                              e.target.checked,
                            )
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div className="flex h-full flex-col justify-center justify-items-center gap-1 text-center">
                        <label className="mx-auto flex text-center text-sm text-gray-400">
                          NULL
                        </label>
                        <input
                          className="database-card-input mx-2 flex justify-center"
                          type="checkbox"
                          checked={col.isNullable}
                          onChange={(e) =>
                            props.updateColumn(
                              index,
                              ci,
                              "isNullable",
                              e.target.checked,
                            )
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div className="flex h-full flex-col justify-center justify-items-center gap-1 text-center">
                        <label className="mx-auto flex text-center text-sm text-gray-400">
                          FK
                        </label>
                        <input
                          className="database-card-input"
                          type="checkbox"
                          checked={col.isUnique}
                          onChange={(e) =>
                            props.updateColumn(
                              index,
                              ci,
                              "isUnique",
                              e.target.checked,
                            )
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <div className="flex">
                        <button
                          className="ml-auto"
                          onClick={() => props.removeColumn(index, ci)}
                        >
                          <TrashIcon className="mx-4 h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="text-blue-600"
              onClick={() => props.addColumn(index)}
            >
              + Add Column
            </button>
          </>
        )}
      </div>
    </>
  );
}
