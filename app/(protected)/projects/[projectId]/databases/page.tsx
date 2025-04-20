"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import mermaid from "mermaid";
import { saveAs } from "file-saver";
import { Canvg } from "canvg";
import { v4 as uuid } from "uuid";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
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

export default function DatabaseTab() {
  const dispatch = useAppDispatch();
  const { projectId } = useParams() as { projectId?: string };

  // Redux selectors
  const schemas = useAppSelector((s) =>
    selectDatabasesByProject(s, projectId ?? ""),
  );
  const status = useAppSelector((s) =>
    selectDatabaseStatusByProject(s, projectId ?? ""),
  );

  // 1️⃣ Fetch schemas on initial mount when status is idle
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDatabases(projectId ?? ""));
    }
  }, [dispatch, projectId, status]);

  // Component state & refs
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

  // 2️⃣ Auto-load first schema once fetch succeeded
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

  // 3️⃣ Render Mermaid ER diagram when renderSchema changes
  useEffect(() => {
    if (!renderSchema?.tables?.length) return;
    if (
      !renderSchema.tables[0]?.columns?.length ||
      renderSchema.tables[0]?.columns[0]?.name === ""
    )
      return;
    if (diagramRef.current) {
      const def = generateERDiagram(renderSchema, {
        theme: "dark",
        title: "ER Diagram",
      });
      diagramRef.current.innerHTML = "";
      mermaid
        .render("er-diagram", def)
        .then(({ svg }) => (diagramRef.current!.innerHTML = svg));
    }
    setExpandedGroups(
      Object.fromEntries(renderSchema.tables.map((t) => [t?.name ?? "", true])),
    );
  }, [renderSchema]);

  // Helper: Collapse/Expand
  const handleCollapseAll = () => {
    setExpandedGroups((prev) =>
      Object.fromEntries(Object.keys(prev).map((k) => [k, !prev?.[k]])),
    );
  };

  // 🌩️ File drop handler
  const onFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDropError(null);
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    try {
      const parsed = await parseUploadedSchema(file);
      if (parsed?.tables?.length === 0)
        throw new Error("No tables found in uploaded schema");
      const formatted = parsed.map((t: any) => ({
        id: uuid(),
        name: t?.name,
        columns: t?.columns?.map((c: any) => ({ ...c, id: uuid() })),
      }));
      setSchema(formatted ?? { tables: [], relationships: [] });
      toast.success("Schema imported successfully");
    } catch (err: any) {
      toast.error(err?.message || "Failed to parse schema");
    }
  };

  // 🗑️ Delete
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

  // 💾 Save (update existing or create new)
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

  const handleSaveSchema = () =>
    selectedSchemaId ? updateExistingSchema() : setIsNamingOpen(true);

  const saveNewSchema = async (title: string) => {
    try {
      const created = await dispatch(
        createDatabase({ projectId: projectId ?? "", title, data: schema }),
      ).unwrap();
      setSelectedSchemaId(created?.id ?? null);
      toast.success("New schema created");
    } catch (err: any) {
      toast.error(err?.message);
    }
  };

  // 📂 Load selected schema
  const handleLoadSchema = (id: string) => {
    const found = schemas?.find((s) => s?.id === id);
    console.log("found", found);
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

  // 📤 Export schema
  const handleExport = () => {
    const output = exportSchema(schema, exportFormat);
    saveAs(
      new Blob([output], { type: "text/plain" }),
      `schema_export.${exportFormat}`,
    );
  };

  // 📈 Export diagram
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

  // ➕ Table & column helpers
  const addTable = () =>
    setSchema((prev) => ({
      ...prev,
      tables: [
        ...(prev?.tables ?? []),
        {
          id: uuid(),
          name: `Table${(prev?.tables?.length ?? 0) + 1}`,
          columns: [],
        },
      ],
    }));
  const updateTable = (i: number, tbl: Table) =>
    setSchema((prev) => {
      const copy = [...(prev?.tables ?? [])];
      copy[i] = tbl;
      return { ...(prev ?? {}), tables: copy };
    });
  const addColumn = (ti: number) => {
    const tbl = schema?.tables?.[ti];
    if (!tbl) return;
    updateTable(ti, {
      ...tbl,
      columns: [
        ...(tbl?.columns ?? []),
        {
          name: "",
          type: "VARCHAR",
          isPrimary: false,
          isNullable: false,
          isUnique: false,
        },
      ],
    });
  };
  const toggleGroup = (name: string) =>
    setExpandedGroups((prev) => ({ ...prev, [name]: !prev?.[name] }));
  const updateColumn = (
    ti: number,
    ci: number,
    field: keyof Column,
    value: any,
  ) => {
    const tbl = schema?.tables?.[ti];
    const cols = [...(tbl?.columns ?? [])];
    cols[ci] = { ...cols[ci], [field]: value };
    updateTable(ti, { ...tbl, columns: cols } as Table);
  };
  const removeColumn = (ti: number, ci: number) => {
    const tbl = schema?.tables?.[ti];
    const cols = tbl?.columns?.filter((_, idx) => idx !== ci) ?? [];
    updateTable(ti, { ...tbl, columns: cols } as Table);
  };

  // Props for subcomponents
  const toolbarProps = {
    onSaveSchema: handleSaveSchema,
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
      {/* {schema?.tables?.length > 0 && <ERDiagramView schema={renderSchema} />} */}
    </>
  );
}
