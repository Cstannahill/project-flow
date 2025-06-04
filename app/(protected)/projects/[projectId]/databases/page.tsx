"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { saveAs } from "file-saver";
import { Canvg } from "canvg";
import { v4 as uuid } from "uuid";
import { generateERDiagram } from "@/lib/erDiagram";
import { exportSchema } from "@/lib/exportSchema";
import { parseUploadedSchema } from "@/lib/schemaParsers";
import type { Column, Table } from "@/types/entities/databases";
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
import DatabaseToolbar from "@/components/databases/DatabaseToolbar";
import SchemaDropzone from "@/components/databases/SchemaDropzone";
import SchemaTableList from "@/components/databases/SchemaTableList";
import ERDiagramView from "@/components/databases/ERDiagramView";
import DatabaseActions, {
  DatabaseActionProps,
} from "@/components/databases/DatabaseActions";
import { store } from "@/lib/store";

export default function DatabaseTab() {
  const dispatch = useAppDispatch();
  const { projectId } = useParams() as { projectId?: string };

  const schemas = useAppSelector((s) =>
    selectDatabasesByProject(s, projectId ?? ""),
  );
  const status = useAppSelector((s) =>
    selectDatabaseStatusByProject(s, projectId ?? ""),
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDatabases(projectId ?? ""));
    }
  }, [dispatch, projectId, status]);

  const diagramRef = useRef<HTMLDivElement>(null);
  const [schema, setSchema] = useState<SchemaData>({
    tables: [],
    relationships: [],
  });
  const [renderSchema, setRenderSchema] = useState<SchemaData>(schema);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const [dropError, setDropError] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<
    "sql" | "prisma" | "dbml" | "json"
  >("sql");
  const [exportDiagramType, setExportDiagramType] = useState<"svg" | "png">(
    "svg",
  );
  const [isNamingOpen, setIsNamingOpen] = useState(false);
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null);
  const hasAutoLoaded = useRef(false);

  useEffect(() => {
    if (
      status === "succeeded" &&
      schemas?.length > 0 &&
      !selectedSchemaId &&
      !hasAutoLoaded.current
    ) {
      handleLoadSchema(schemas[0]?.id ?? "");
      hasAutoLoaded.current = true;
    }
  }, [status, schemas, selectedSchemaId]);

  useEffect(() => {
    if (renderSchema?.tables?.length) {
      setExpandedGroups(
        Object.fromEntries(
          renderSchema.tables.map((t) => [t?.name ?? "", true]),
        ),
      );
    }
  }, [renderSchema]);

  const handleCollapseAll = () => {
    setExpandedGroups((prev) =>
      Object.fromEntries(Object.keys(prev).map((k) => [k, !prev?.[k]])),
    );
  };

  const onFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropError(null);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    try {
      const parsed = await parseUploadedSchema(file);
      if (parsed?.tables?.length === 0)
        throw new Error("No tables found in uploaded schema");
      const formatted = parsed?.tables?.map((t: any) => ({
        id: uuid(),
        name: t?.name,
        columns: t?.columns?.map((c: any) => ({ ...c, id: uuid() })),
      }));
      const nextSchema = { tables: formatted, relationships: [] };
      setSchema(nextSchema);
      setRenderSchema(nextSchema);
      toast.success("Schema imported successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to parse schema");
    }
  };

  const handleDeleteSchema = async () => {
    if (!selectedSchemaId) return;
    try {
      await dispatch(deleteDatabase({ id: selectedSchemaId })).unwrap();
      toast.success("Schema deleted");
      setSelectedSchemaId(null);
      setSchema({ tables: [], relationships: [] });
      setRenderSchema({ tables: [], relationships: [] });
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  const updateExistingSchema = async () => {
    if (!selectedSchemaId) return;
    try {
      await dispatch(
        updateDatabase({
          projectId: projectId ?? "",
          databaseId: selectedSchemaId,
          title: schema?.name ?? schema?.title ?? "Untitled",
          data: schema,
        }),
      ).unwrap();
      await dispatch(fetchDatabases(projectId ?? ""));
      handleLoadSchema(selectedSchemaId);
      toast.success("Schema updated");
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  const saveNewSchema = async (title: string) => {
    try {
      const created = await dispatch(
        createDatabase({ projectId: projectId ?? "", title, data: schema }),
      ).unwrap();

      // Force Redux state to refresh
      await dispatch(fetchDatabases(projectId ?? "")).unwrap();

      // Pull updated state from selector AFTER hydration
      const updatedSchemas = selectDatabasesByProject(
        store.getState(), // ⬅️ You’ll need to import `store` to access the current state
        projectId ?? "",
      );

      const rehydrated = updatedSchemas.find((s) => s.id === created.id);
      if (rehydrated) {
        handleLoadSchema(rehydrated.id);
        setSelectedSchemaId(rehydrated.id);
      }

      toast.success("New schema created");
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  const handleLoadSchema = (id: string) => {
    const found = schemas?.find((s) => s?.id === id);
    if (!found) return;
    const withIds: SchemaData = {
      ...found?.data,
      tables:
        found?.data?.tables?.map((t) => ({
          ...t,
          id: uuid(),
          columns: t?.columns?.map((c) => ({ ...c, id: uuid() })),
        })) ?? [],
    };
    setSchema(withIds);
    setRenderSchema(withIds);
    setSelectedSchemaId(id);
  };

  const handleNewSchema = () => {
    const empty = { tables: [], relationships: [] } as SchemaData;
    setSchema(empty);
    setRenderSchema(empty);
    setSelectedSchemaId(null);
  };

  const handleExport = () => {
    const output = exportSchema(schema, exportFormat);
    saveAs(
      new Blob([output], { type: "text/plain" }),
      `schema_export.${exportFormat}`,
    );
  };

  const handleExportDiagram = async () => {
    const svg = diagramRef.current?.querySelector("svg");
    if (!svg) return;
    svg?.setAttribute("style", "font-family:Arial,sans-serif");
    const svgString = new XMLSerializer()?.serializeToString(svg);
    if (exportDiagramType === "svg") {
      saveAs(new Blob([svgString], { type: "image/svg+xml" }), "diagram.svg");
    } else {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { width, height } = svg?.getBoundingClientRect() ?? {
        width: 0,
        height: 0,
      };
      canvas.width = width;
      canvas.height = height;
      const v = await Canvg.from(ctx, svgString ?? "", {
        ignoreDimensions: true,
      });
      await v?.render();
      canvas?.toBlob((b) => b && saveAs(b, "diagram.png"));
    }
  };

  const addTable = () => {
    const newTable = {
      id: uuid(),
      name: `Table${schema.tables.length + 1}`,
      columns: [],
    };
    setSchema((prev) => {
      const updated = { ...prev, tables: [...prev.tables, newTable] };
      setRenderSchema(updated);
      setExpandedGroups((prevGroups) => ({
        ...prevGroups,
        [newTable.name]: true,
      }));
      return updated;
    });
  };

  const updateTable = (i: number, updated: Table) => {
    setSchema((prev) => {
      const tables = [...prev.tables];
      tables[i] = { ...updated };
      return { ...prev, tables };
    });
  };
  const addColumn = (ti: number) => {
    setSchema((prev) => {
      const newSchema = { ...prev };
      const newTables = [...newSchema.tables];
      const table = { ...newTables[ti] };

      const newColumns = [...(table.columns ?? [])];
      newColumns.push({
        name: "",
        type: "VARCHAR",
        isPrimary: false,
        isNullable: false,
        isUnique: false,
      });

      table.columns = newColumns;
      newTables[ti] = table;
      newSchema.tables = newTables;
      return newSchema;
    });
  };
  const updateColumn = (
    ti: number,
    ci: number,
    field: keyof Column,
    value: any,
  ) => {
    setSchema((prev) => {
      const newSchema = { ...prev };
      const tables = [...newSchema.tables];
      const table = { ...tables[ti] };
      const columns = [...table.columns];
      columns[ci] = { ...columns[ci], [field]: value };
      table.columns = columns;
      tables[ti] = table;
      newSchema.tables = tables;
      return newSchema;
    });
  };

  const removeColumn = (ti: number, ci: number) => {
    setSchema((prev) => {
      const newSchema = { ...prev };
      const tables = [...newSchema.tables];
      const table = { ...tables[ti] };
      table.columns = table.columns.filter((_, idx) => idx !== ci);
      tables[ti] = table;
      newSchema.tables = tables;
      return newSchema;
    });
  };

  const toggleGroup = (name: string) =>
    setExpandedGroups((prev) => ({ ...prev, [name]: !prev?.[name] }));

  const toolbarProps = {
    onSaveSchema: saveNewSchema,
    onAddTable: addTable,
    onGenerateDiagram: () => setRenderSchema(schema),
    isNamingOpen,
    setIsNamingOpen,
    onSaveNewSchema: saveNewSchema,
  };
  const dropzoneProps = {
    onFileDrop,
    dropError,
    schemas,
    selectedSchemaId,
    onLoadSchema: handleLoadSchema,
    onNewSchema: handleNewSchema,
  };
  const tableListProps = {
    tables: schema?.tables,
    onTableChange: updateTable,
    onToggleGroup: toggleGroup,
    expandedGroups,
    addColumn,
    updateColumn,
    removeColumn,
  };
  const databaseActionsProps: DatabaseActionProps = {
    exportFormat,
    setExportFormat,
    exportDiagramType,
    setExportDiagramType,
    handleExport,
    handleExportDiagram,
    handleCollapseAll,
    handleDeleteSchema,
  };

  return (
    <>
      <DatabaseActions {...databaseActionsProps} />
      <DatabaseToolbar {...toolbarProps} />
      <SchemaDropzone {...dropzoneProps} />
      <SchemaTableList {...tableListProps} />
      <div className="mt-6 rounded-lg border border-zinc-700 bg-[#1b1916] p-4">
        <ERDiagramView schema={renderSchema} />
      </div>
    </>
  );
}
