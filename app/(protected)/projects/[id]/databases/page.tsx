"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import mermaid from "mermaid";
import { generateERDiagram } from "@/lib/erDiagram";
import { parsePrismaSchema, parseSQLSchema } from "@/lib/schemaParsers";

type Column = {
  name: string;
  type: string;
  isPrimary?: boolean;
  isNullable?: boolean;
  isUnique?: boolean;
};

type Table = {
  name: string;
  columns: Column[];
};

const sqlTypes = [
  "INT",
  "VARCHAR",
  "TEXT",
  "BOOLEAN",
  "DATE",
  "TIMESTAMP",
  "DECIMAL",
  "FLOAT",
  "UUID",
];

export default function DatabaseTab({ params }) {
  const { id: projectId } = React.use(params);
  const router = useRouter();
  const diagramRef = useRef<HTMLDivElement>(null);

  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [schemas, setSchemas] = useState<any[]>([]);
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null);
  const [dropError, setDropError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/projects/${projectId}/databases`)
      .then((res) => res.json())
      .then(setSchemas);
  }, [projectId]);

  useEffect(() => {
    if (diagramRef.current) {
      const definition = generateERDiagram(tables);
      diagramRef.current.innerHTML = "";
      mermaid.render("er-diagram", definition).then(({ svg }) => {
        diagramRef.current!.innerHTML = svg;
      });
    }
  }, [tables]);

  const handleSaveSchema = async () => {
    const title = prompt("Enter a title for this schema:");
    if (!title) return;

    const res = await fetch(`/api/projects/${projectId}/databases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, data: tables }),
    });

    if (res.ok) {
      const created = await res.json();
      setSchemas((prev) => [created, ...prev]);
      setSelectedSchemaId(created.id);
      alert("Schema saved!");
    } else {
      alert("Failed to save schema.");
    }
  };

  const handleLoadSchema = (schemaId: string) => {
    const schema = schemas.find((s) => s.id === schemaId);
    if (schema) {
      setTables(schema.data);
      setSelectedSchemaId(schemaId);
    }
  };

  const onFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropError(null);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const text = await file.text();
    try {
      let parsed: Table[] = [];

      if (file.name.endsWith(".prisma")) {
        parsed = parsePrismaSchema(text);
      } else if (file.name.endsWith(".sql")) {
        parsed = parseSQLSchema(text);
      } else {
        throw new Error("Unsupported file type.");
      }

      if (parsed.length === 0) throw new Error("No tables found in schema.");
      setTables(parsed);
      alert("Schema imported successfully!");
    } catch (err: any) {
      setDropError(err.message || "Failed to parse schema.");
    }
  };

  const addTable = () => {
    setTables((prev) => [
      ...prev,
      { name: `Table${prev.length + 1}`, columns: [] },
    ]);
  };

  const updateTable = (index: number, updated: Table) => {
    const copy = [...tables];
    copy[index] = updated;
    setTables(copy);
  };

  const addColumn = (tableIndex: number) => {
    const table = tables[tableIndex];
    const column: Column = {
      name: "",
      type: "VARCHAR",
      isPrimary: false,
      isNullable: false,
      isUnique: false,
    };
    updateTable(tableIndex, { ...table, columns: [...table.columns, column] });
  };

  const updateColumn = (
    tableIndex: number,
    columnIndex: number,
    field: keyof Column,
    value: any
  ) => {
    const table = tables[tableIndex];
    const columns = [...table.columns];
    columns[columnIndex] = { ...columns[columnIndex], [field]: value };
    updateTable(tableIndex, { ...table, columns });
  };

  const removeColumn = (tableIndex: number, columnIndex: number) => {
    const table = tables[tableIndex];
    const columns = [...table.columns];
    columns.splice(columnIndex, 1);
    updateTable(tableIndex, { ...table, columns });
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onFileDrop}
      className="space-y-6 border-2 border-dashed border-blue-300 p-4 rounded"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">Database Schema</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium mb-1">Schema</label>
            <select
              value={selectedSchemaId || ""}
              onChange={(e) => handleLoadSchema(e.target.value)}
              className="bg-white dark:bg-neutral-900 border px-2 py-1 rounded"
            >
              <option value="">— Select saved schema —</option>
              {schemas.map((schema) => (
                <option key={schema.id} value={schema.id}>
                  {schema.title}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSaveSchema}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            💾 Save Schema
          </button>
          <button
            onClick={addTable}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Table
          </button>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium mb-1">
          Import schema file (.prisma or .sql)
        </label>
        <input
          type="file"
          accept=".sql,.prisma"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const text = await file.text();
            try {
              let parsed: Table[] = [];

              if (file.name.endsWith(".prisma")) {
                parsed = parsePrismaSchema(text);
              } else if (file.name.endsWith(".sql")) {
                parsed = parseSQLSchema(text);
              } else {
                throw new Error("Unsupported file type.");
              }

              if (parsed.length === 0)
                throw new Error("No tables found in schema.");
              setTables(parsed);
              alert("Schema imported successfully!");
            } catch (err: any) {
              setDropError(err.message || "Failed to parse schema.");
            }
          }}
          className="border p-2 rounded bg-white dark:bg-neutral-800"
        />
      </div>

      {dropError && <p className="text-red-600">{dropError}</p>}

      {loading ? (
        <p>Loading database schema...</p>
      ) : tables.length === 0 ? (
        <p className="text-gray-500 italic">No tables defined yet.</p>
      ) : (
        <div className="space-y-6">
          {tables.map((table, i) => (
            <div
              key={i}
              className="border rounded-lg p-4 bg-white dark:bg-neutral-900 shadow-sm"
            >
              <input
                type="text"
                value={table.name}
                onChange={(e) =>
                  updateTable(i, { ...table, name: e.target.value })
                }
                placeholder="Table name"
                className="text-lg font-semibold border-b bg-transparent w-full mb-3"
              />

              <table className="w-full text-sm table-auto">
                <thead>
                  <tr className="text-left border-b">
                    <th>Column</th>
                    <th>Type</th>
                    <th>Primary</th>
                    <th>Nullable</th>
                    <th>Unique</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((col, j) => (
                    <tr key={j} className="border-t">
                      <td>
                        <input
                          value={col.name}
                          onChange={(e) =>
                            updateColumn(i, j, "name", e.target.value)
                          }
                          className="w-full bg-transparent border rounded px-2 py-1"
                        />
                      </td>
                      <td>
                        <select
                          value={col.type}
                          onChange={(e) =>
                            updateColumn(i, j, "type", e.target.value)
                          }
                          className="w-full bg-transparent border rounded px-2 py-1"
                        >
                          {sqlTypes.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={col.isPrimary}
                          onChange={(e) =>
                            updateColumn(i, j, "isPrimary", e.target.checked)
                          }
                        />
                      </td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={col.isNullable}
                          onChange={(e) =>
                            updateColumn(i, j, "isNullable", e.target.checked)
                          }
                        />
                      </td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={col.isUnique}
                          onChange={(e) =>
                            updateColumn(i, j, "isUnique", e.target.checked)
                          }
                        />
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => removeColumn(i, j)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-2 text-right">
                <button
                  onClick={() => addColumn(i)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Add Column
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tables.length > 0 && (
        <div className="mt-10 border-t pt-6">
          <h3 className="text-lg font-semibold mb-2">📊 ER Diagram Preview</h3>
          <div
            ref={diagramRef}
            className="bg-white dark:bg-neutral-900 border p-4 rounded-md overflow-auto"
          />
        </div>
      )}
    </div>
  );
}
