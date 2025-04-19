"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { TrashIcon } from "@heroicons/react/24/solid";
import { saveAs } from "file-saver";
import { Canvg } from "canvg";

import { generateERDiagram } from "@/lib/erDiagram";
import { exportSchema } from "@/lib/exportSchema";
import { parseUploadedSchema } from "@/lib/schemaParsers";
import type { Column, Relationship, SchemaData, Table } from "@/types/base";

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

export default function DatabaseTab() {
  const { projectId } = useParams();
  const diagramRef = useRef<HTMLDivElement>(null);

  const [schema, setSchema] = useState<SchemaData>({
    tables: [],
    relationships: [],
  });
  const [schemas, setSchemas] = useState<any[]>([]);
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {} as Record<string, boolean>
  );
  const [dropError, setDropError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<
    "sql" | "prisma" | "dbml" | "json"
  >("sql");
  const [exportDiagramType, setExportDiagramType] = useState<"svg" | "png">(
    "svg"
  );

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/projects/${projectId}/databases`)
      .then((res) => res.json())
      .then(setSchemas);
  }, [projectId]);

  useEffect(() => {
    if (diagramRef.current) {
      const definition = generateERDiagram(schema);
      diagramRef.current.innerHTML = "";
      mermaid.render("er-diagram", definition).then(({ svg }) => {
        diagramRef.current!.innerHTML = svg;
      });
    }

    setExpandedGroups(
      Object.fromEntries(schema?.tables?.map((t) => [t.name, true]))
    );
  }, [schema]);

  const handleCollapseAll = () => {
    setExpandedGroups((prev) =>
      Object.fromEntries(Object.keys(prev).map((k) => [k, !prev[k]]))
    );
  };

  const onFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropError(null);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    try {
      const parsed = await parseUploadedSchema(file);
      if (parsed.tables.length === 0)
        throw new Error("No tables found in schema.");
      setSchema(parsed);
      alert("Schema imported successfully!");
    } catch (err: any) {
      setDropError(err.message || "Failed to parse schema.");
    }
  };

  const handleSaveSchema = async () => {
    const title = prompt("Enter a title for this schema:");
    if (!title || !projectId) return;

    const res = await fetch(`/api/projects/${projectId}/databases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, data: schema }),
    });

    if (res.ok) {
      const created = await res.json();
      setSchemas((prev) => [created, ...prev]);
      setSelectedSchemaId(created.id);
    } else {
      alert("Failed to save schema.");
    }
  };

  const handleLoadSchema = (id: string) => {
    const found = schemas.find((s) => s.id === id);
    if (found) {
      setSchema(found.data);
      setSelectedSchemaId(id);
    }
  };

  const handleExport = () => {
    const output = exportSchema(schema, exportFormat);
    saveAs(
      new Blob([output], { type: "text/plain" }),
      `schema_export.${exportFormat}`
    );
  };

  const handleExportDiagram = async () => {
    if (!diagramRef.current) return;
    const svg = diagramRef.current.querySelector("svg");
    if (!svg) return;

    svg.setAttribute("style", "font-family: Arial, sans-serif;");
    const svgString = new XMLSerializer().serializeToString(svg);

    if (exportDiagramType === "svg") {
      saveAs(new Blob([svgString], { type: "image/svg+xml" }), "diagram.svg");
    } else {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = svg.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;

      const v = await Canvg.from(ctx, svgString, {
        ignoreDimensions: true,
        ignoreClear: true,
        ignoreAnimation: true,
      });
      await v.render();

      canvas.toBlob((blob) => {
        if (blob) saveAs(blob, "diagram.png");
      });
    }
  };

  const addTable = () => {
    setSchema((prev) => ({
      ...prev,
      tables: [
        ...prev.tables,
        { name: `Table${prev.tables.length + 1}`, columns: [] },
      ],
    }));
  };

  const updateTable = (index: number, updated: Table) => {
    const updatedTables = [...schema.tables];
    updatedTables[index] = updated;
    setSchema((prev) => ({ ...prev, tables: updatedTables }));
  };

  const addColumn = (tableIndex: number) => {
    const table = schema.tables[tableIndex];
    const newCol: Column = {
      name: "",
      type: "VARCHAR",
      isPrimary: false,
      isNullable: false,
      isUnique: false,
    };
    const updated = { ...table, columns: [...table.columns, newCol] };
    updateTable(tableIndex, updated);
  };
  const toggleGroup = (type: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
    console.log(expandedGroups);
  };
  const updateColumn = (
    ti: number,
    ci: number,
    field: keyof Column,
    value: any
  ) => {
    const table = schema.tables[ti];
    const updatedCols = [...table.columns];
    updatedCols[ci] = { ...updatedCols[ci], [field]: value };
    updateTable(ti, { ...table, columns: updatedCols });
  };

  const removeColumn = (ti: number, ci: number) => {
    const table = schema.tables[ti];
    const updatedCols = [...table.columns];
    updatedCols.splice(ci, 1);
    updateTable(ti, { ...table, columns: updatedCols });
  };

  return (
    <>
      <div className="space-y-4 p-2">
        {schema.tables.length > 0 && (
          <div className="mt-0 flex gap-4 flex-row-reverse">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="border px-2 py-1 rounded"
            >
              <option value="sql">SQL</option>
              <option value="prisma">Prisma</option>
              <option value="dbml">DBML</option>
              <option value="json">JSON</option>
            </select>
            <button
              onClick={handleExport}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Export Schema
            </button>
            <select
              value={exportDiagramType}
              onChange={(e) => setExportDiagramType(e.target.value as any)}
              className="border px-2 py-1 rounded"
            >
              <option value="svg">SVG</option>
              <option value="png">PNG</option>
            </select>
            <button
              onClick={handleExportDiagram}
              className="bg-indigo-600 text-white px-4 py-1 rounded"
            >
              Export Diagram
            </button>
            <button className="ct-btn bg-gray-400" onClick={handleCollapseAll}>
              {expandedGroups ? "Collapse All" : "Expand All"}
            </button>
          </div>
        )}
        <div
          className="flex justify-between items-center flex-wrap gap-4 border-2 border-dashed border-blue-300 rounded p-5"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onFileDrop}
        >
          <h2 className="text-xl font-semibold">Database Schema</h2>
          <small className="text-gray-500">
            Drag a file to upload {`(.sql, .prisma, .dbml, .json)`}
          </small>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleSaveSchema}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              💾 Save
            </button>
            <button
              onClick={addTable}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              ➕ Add Table
            </button>
            <select
              value={selectedSchemaId || ""}
              onChange={(e) => handleLoadSchema(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="">— Load Schema —</option>
              {schemas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {dropError && <p className="text-red-600">{dropError}</p>}

        <div className="space-y-4">
          {schema.tables.map((table, ti) => (
            <div
              key={table.name}
              className="border p-4 rounded bg-white dark:bg-neutral-900"
            >
              <div className="flex flex-inline gap-3">
                <input
                  type="text"
                  value={table.name}
                  onChange={(e) =>
                    updateTable(ti, { ...table, name: e.target.value })
                  }
                  placeholder="Table name"
                  className="font-semibold border-b w-full bg-transparent mb-3 flex-shrink"
                />
                <p
                  className="px-3 cursor-pointer font-bold text-lg"
                  onClick={() => toggleGroup(table.name)}
                >
                  {expandedGroups[table.name] !== false ? "▾" : "▸"}
                </p>
              </div>
              {expandedGroups[table.name] !== false && (
                <table className="w-full text-sm table-auto">
                  <thead>
                    <tr className="text-left border-b">
                      <th>Column</th>
                      <th>Type</th>
                      <th>PK</th>
                      <th>NULL</th>
                      <th>UK</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns.map((col, ci) => (
                      <tr key={ci} className="border-t">
                        <td>
                          <input
                            value={col.name}
                            onChange={(e) =>
                              updateColumn(ti, ci, "name", e.target.value)
                            }
                            className="w-full border px-2 py-1 rounded"
                          />
                        </td>
                        <td>
                          <select
                            value={col.type}
                            onChange={(e) =>
                              updateColumn(ti, ci, "type", e.target.value)
                            }
                            className="w-full border px-2 py-1 rounded"
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
                              updateColumn(
                                ti,
                                ci,
                                "isPrimary",
                                e.target.checked
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            checked={col.isNullable}
                            onChange={(e) =>
                              updateColumn(
                                ti,
                                ci,
                                "isNullable",
                                e.target.checked
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            checked={col.isUnique}
                            onChange={(e) =>
                              updateColumn(ti, ci, "isUnique", e.target.checked)
                            }
                          />
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => removeColumn(ti, ci)}
                            className="text-red-600"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {expandedGroups[table.name] !== false && (
                <div className="pt-2 text-right">
                  <button
                    onClick={() => addColumn(ti)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    + Add Column
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {schema.tables.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">📊 ER Diagram</h3>
            <div
              ref={diagramRef}
              className="border rounded p-4 bg-white dark:bg-neutral-900 overflow-auto"
            />
          </div>
        )}
      </div>
    </>
  );
}
