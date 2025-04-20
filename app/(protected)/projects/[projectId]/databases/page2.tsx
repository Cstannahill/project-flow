"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { TrashIcon } from "@heroicons/react/24/solid";
import { saveAs } from "file-saver";
import { Canvg } from "canvg";
import { v4 as uuid } from "uuid";
import { generateERDiagram } from "@/lib/erDiagram";
import { exportSchema } from "@/lib/exportSchema";
import { parseUploadedSchema } from "@/lib/schemaParsers";
import type { Column, Relationship, Table } from "@/types/entities/databases";
import type { SchemaData } from "@/types/entities/databases";
import {
  createDatabase,
  deleteDatabase,
  fetchDatabases,
  selectDatabasesByProject,
  selectDatabaseStatusByProject,
  updateDatabase,
} from "@/lib/store/databases";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import toast from "react-hot-toast";
import { CreateSchemaDialog } from "@/components/ui/dialogs/CreateSchemaDialog";
import { DeleteConfirmationDialog } from "@/components/ui/dialogs/DeleteConfirmationDialog";
import { Trash2, Save, Grid2x2Plus, ChartNetwork } from "lucide-react";
import { HelperTooltip } from "@/components/ui/tooltips/HelperTooltip";
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
  const dispatch = useAppDispatch();
  const { projectId } = useParams() as { projectId: string };
  const schemas = useAppSelector((s) =>
    selectDatabasesByProject(s, projectId as string)
  );
  const status = useAppSelector((s) =>
    selectDatabaseStatusByProject(s, projectId as string)
  );
  const diagramRef = useRef<HTMLDivElement>(null);

  // live editing
  const [schema, setSchema] = useState<SchemaData>({
    tables: [],
    relationships: [],
  });

  // the snapshot we actually hand off to Mermaid
  const [renderSchema, setRenderSchema] = useState<SchemaData>(schema);
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
  const [isNamingOpen, setIsNamingOpen] = useState(false);
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null);

  const hasAutoLoaded = useRef(false);

  useEffect(() => {
    if (!hasAutoLoaded.current && schemas.length > 0 && !selectedSchemaId) {
      handleLoadSchema(schemas[0].id);
      console.log("Auto-loaded schema:", schemas[0].id);
      hasAutoLoaded.current = true;
    }
  }, [schemas, selectedSchemaId]);

  useEffect(() => {
    if (
      !renderSchema ||
      !renderSchema?.tables ||
      renderSchema.tables.length < 1 ||
      !renderSchema.tables[0].columns ||
      renderSchema.tables[0].columns.length < 1 ||
      renderSchema.tables[0].columns[0].name === ""
    )
      return;
    if (diagramRef.current) {
      const definition = generateERDiagram(renderSchema, {
        theme: "dark",
        title: "Application Schema ER Diagram",
      });
      diagramRef.current.innerHTML = "";
      mermaid.render("er-diagram", definition).then(({ svg }) => {
        diagramRef.current!.innerHTML = svg;
      });
    }

    setExpandedGroups(
      Object.fromEntries(schema?.tables?.map((t) => [t.name, true]))
    );
  }, [renderSchema]);

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
      const formatted = parsed.map((t: any) => ({
        id: uuid(),
        name: t.name,
        columns: t.columns.map((c: any) => ({
          ...c,
          id: uuid(),
        })),
      }));
      setSchema(formatted);
      toast.success("Schema imported successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to parse schema.");
    }
  };

  const handleDeleteSchema = async () => {
    if (!selectedSchemaId) return;

    try {
      await dispatch(deleteDatabase({ id: selectedSchemaId })).unwrap();
      toast.success("Schema deleted");
      // clear out the selection & local canvas
      setSelectedSchemaId(null);
      setSchema({ tables: [], relationships: [] });
      setRenderSchema({ tables: [], relationships: [] });
    } catch (err: any) {
      toast.error("Failed to delete schema: " + err);
    }
  };
  const handleSaveSchema = () => {
    console.log("handleSaveSchema fired", selectedSchemaId);
    if (selectedSchemaId) {
      updateExistingSchema();
    } else {
      setIsNamingOpen(true);
    }
  };
  const updateExistingSchema = async () => {
    try {
      console.log("FIRING THUNK");
      await dispatch(
        updateDatabase({ databaseId: selectedSchemaId!, data: schema })
      ).unwrap();
      toast.success("Schema updated!");
    } catch (err: any) {
      toast.error("Failed to update schema: " + err);
    }
  };

  const saveNewSchema = async (title: string) => {
    try {
      const created = await dispatch(
        createDatabase({ projectId, title, data: schema })
      ).unwrap();
      setSelectedSchemaId(created.id);
      toast.success("Schema created!");
    } catch (err: any) {
      toast.error("Failed to save schema: " + err);
    }
  };
  const handleLoadSchema = (id: string) => {
    const found = schemas.find((s) => s.id === id);
    if (!found) return;
    // rehydrate with fresh IDs for React lists
    const withIds: SchemaData = {
      ...found.data,
      tables: found.data.tables.map((t) => ({
        ...t,
        id: uuid(),
        columns: t.columns.map((c) => ({ ...c, id: uuid() })),
      })),
    };
    setSchema(withIds);
    setRenderSchema(withIds); // ← immediately update your preview
    setSelectedSchemaId(id);
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
        { id: uuid(), name: `Table${prev.tables.length + 1}`, columns: [] },
      ],
    }));
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    table: any,
    ti: number
  ) => {
    e.preventDefault();
    updateTable(ti, { ...table, name: e.target.value });
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
  console.log(projectId);
  return (
    <>
      <div className="space-y-4 p-2">
        {/* only show delete once something is selected */}
        {selectedSchemaId && (
          <DeleteConfirmationDialog
            trigger={
              <Trash2
                size={30}
                className="cursor-pointer text-red-500 mx-7 float-right"
              />
            }
            title="Delete this schema?"
            onConfirm={handleDeleteSchema}
          />
        )}
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
          <h2 className="text-lg font-semibold">Database Schema</h2>
          <small className="text-gray-500">
            Drag a file to upload {`(.sql, .prisma, .dbml, .json)`}
          </small>
          <div className="inline-flex gap-2 flex-wrap p-2 grow-1 justify-around">
            <div className="flex items-center gap-2 ">
              <div className="flex-col gap-1 mx-2 my-auto">
                <HelperTooltip content="Load a saved schema" placement="bottom">
                  <div
                    onClick={handleSaveSchema}
                    className="bg-none px-2 database-icon-button border border-stone-950/80 rounded-xl py-2 mx-2 cursor-pointer text-white hover:bg-black"
                  >
                    <Save size={30} strokeWidth={2} className="mx-auto" />

                    <P className="text-2xs font-bold text-slate-300 text-center">
                      Save
                    </P>
                  </div>
                </HelperTooltip>
              </div>

              <CreateSchemaDialog
                open={isNamingOpen}
                onCancel={() => setIsNamingOpen(false)}
                onConfirm={async (name: string) => {
                  setIsNamingOpen(false);
                  await saveNewSchema(name);
                }}
              />
              <div className="flex-col mx-2 gap-1 my-auto">
                <HelperTooltip
                  content="Add a new table to the current schema"
                  placement="bottom"
                >
                  <div
                    onClick={addTable}
                    className="bg-none px-2 rounded-xl database-icon-button border border-stone-950/80 py-2 mx-2 cursor-pointer text-white hover:bg-black"
                  >
                    <Grid2x2Plus
                      size={30}
                      strokeWidth={2}
                      className="mx-auto"
                    />{" "}
                    <P className="text-2xs font-bold text-slate-300 text-center truncate">
                      Add Table
                    </P>
                  </div>{" "}
                </HelperTooltip>
              </div>
              <div className="flex-col gap-1 mx-2 my-auto">
                <HelperTooltip content="Generate ER Diagram" placement="bottom">
                  <div
                    className="bg-none p-2 rounded-xl border border-stone-950/80 database-icon-button mx-2 cursor-pointer  text-white "
                    onClick={() => setRenderSchema(schema)}
                  >
                    <ChartNetwork
                      size={30}
                      strokeWidth={2}
                      className="mx-auto"
                    />
                    <P className="text-2xs font-bold text-slate-300 text-center">
                      Gen ER
                    </P>
                  </div>
                </HelperTooltip>
              </div>
            </div>
          </div>
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

        {dropError && <P className="text-red-600">{dropError}</P>}

        <div className="space-y-4">
          {schema.tables.map((table, ti) => (
            <div
              key={table.id}
              className="border p-4 rounded bg-white dark:bg-neutral-900"
            >
              <div className="flex flex-inline gap-3">
                <input
                  type="text"
                  value={table.name}
                  onChange={(e) => handleChange(e, table, ti)}
                  placeholder="Table name"
                  className="font-semibold border-b w-full bg-transparent mb-3 flex"
                />
                <P
                  className="px-3 cursor-pointer font-bold text-lg"
                  onClick={() => toggleGroup(table.name)}
                >
                  {expandedGroups[table.name] !== false ? "▾" : "▸"}
                </P>
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
