// components/apis/ApiRouteDialog.tsx
"use client";

import React, { useState, FormEvent, useEffect } from "react";
import BaseDialog from "./BaseDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "../button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Option } from "@/components/ui/Option";
import { Editor } from "@monaco-editor/react";
import { Label } from "../label";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectId } from "@/hooks/useProjectId";
import type { ApiRoutePayload } from "@/types/entities/apiRoutes";

interface Props {
  open: boolean;
  onCloseAction: () => void;
  initialData?: ApiRoutePayload;
  doRefreshAction: () => void;
  onSaveAction: (data: ApiRoutePayload) => void;
}

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

// Define the fields you want on the “Details” tab:
const fields: Array<{
  name: keyof ApiRoutePayload;
  label: string;
  type: "text" | "textarea" | "select";
  options?: { value: string; label: string }[];
  colSpan?: number;
}> = [
  { name: "path", label: "Path", type: "text", colSpan: 2 },
  {
    name: "method",
    label: "HTTP Method",
    type: "select",
    options: METHODS.map((m) => ({ value: m, label: m })),
  },
  { name: "summary", label: "Summary", type: "text", colSpan: 2 },
  { name: "description", label: "Description", type: "textarea", colSpan: 2 },
];

export default function ApiRouteDialog({
  open,
  onCloseAction,
  initialData,
  onSaveAction,
}: Props) {
  const projectId = useProjectId();
  const defaults: ApiRoutePayload = {
    id: "",
    projectId,
    path: "",
    method: "GET",
    summary: "",
    description: "",
    params: {},
    query: {},
    body: {},
    responses: {},
  };
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"details" | "json">("details");

  // initialize form state by merging defaults + initialData
  const [data, setData] = useState<ApiRoutePayload>({
    ...defaults,
    ...initialData,
  });

  // **RESEED** whenever initialData or projectId changes
  useEffect(() => {
    setData({ ...defaults, ...initialData, projectId });
  }, [initialData, projectId]);

  function handleChange<K extends keyof ApiRoutePayload>(
    key: K,
    value: ApiRoutePayload[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSaveAction(data);
    } finally {
      setLoading(false);
    }
  }

  const footer = (
    <>
      <Button
        color="cyan"
        type="submit"
        form="api-route-form"
        disabled={loading}
      >
        {loading ? <Skeleton className="h-4 w-12" /> : "Save"}
      </Button>
      <Button color="secondary" onClick={onCloseAction}>
        Close
      </Button>
    </>
  );

  return (
    <BaseDialog
      size="4xl"
      open={open}
      onCloseAction={onCloseAction}
      title={initialData ? "Edit API Route" : "New API Route"}
      actions={footer}
    >
      <form
        id="api-route-form"
        className="space-y-6"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as any)}
          className="w-full space-y-6"
        >
          <TabsList>
            <TabsTrigger data-state="active" value="details">
              Details
            </TabsTrigger>
            <TabsTrigger data-state="active" value="json">
              Raw JSON
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map(({ name, label, type, options, colSpan }) => {
                const spanClass = colSpan ? `sm:col-span-${colSpan}` : "";
                const commonProps = {
                  id: name,
                  name: name,
                  value: String(data[name] ?? ""),
                  onChange: (
                    e: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >,
                  ) => handleChange(name, e.target.value as any),
                  placeholder: label,
                  className: spanClass,
                };

                if (type === "text")
                  return (
                    <div
                      key={name as string}
                      className={`flex flex-col gap-1 ${spanClass}`}
                    >
                      <Label htmlFor={name}>{label}</Label>
                      <Input {...commonProps} />
                    </div>
                  );

                if (type === "textarea")
                  return (
                    <div
                      key={name as string}
                      className={`flex flex-col gap-1 ${spanClass}`}
                    >
                      <Label htmlFor={name}>{label}</Label>
                      <Textarea {...commonProps} rows={4} />
                    </div>
                  );

                if (type === "select")
                  return (
                    <div
                      key={name as string}
                      className={`flex flex-col gap-1 ${spanClass}`}
                    >
                      <Label htmlFor={name}>{label}</Label>
                      <Select
                        name={String(name)}
                        value={String(data[name])}
                        onValueChange={(val) => handleChange(name, val as any)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={label} />
                        </SelectTrigger>
                        <SelectContent>
                          {options?.map((opt) => (
                            <Option
                              key={opt.value}
                              value={opt.value}
                              label={opt.label}
                            />
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );

                return null;
              })}
            </div>

            <section className="grid grid-cols-2 grid-rows-2 gap-4 text-center">
              {(
                [
                  ["params", "Request Params"],
                  ["body", "Request Body"],
                  ["query", "Query"],
                  ["responses", "Responses"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label className="mx-auto">{label}</Label>
                  <Editor
                    height="15vh"
                    defaultLanguage="json"
                    theme="vs-dark"
                    value={JSON.stringify(data[key], null, 2)}
                    onChange={(v) => {
                      try {
                        handleChange(
                          key as keyof ApiRoutePayload,
                          JSON.parse(v || "{}"),
                        );
                      } catch {
                        /* ignore parse errors until valid JSON */
                      }
                    }}
                    options={{ minimap: { enabled: false }, fontSize: 14 }}
                  />
                </div>
              ))}
            </section>
          </TabsContent>

          <TabsContent value="json">
            <Label>Raw JSON (full payload)</Label>
            <Editor
              height="50vh"
              defaultLanguage="json"
              theme="vs-dark"
              value={JSON.stringify(data, null, 2)}
              onChange={(v) => {
                try {
                  const parsed = JSON.parse(v || "{}");
                  setData((d) => ({ ...d, openApiSpec: { ...parsed } }));
                } catch {
                  // ignore
                }
              }}
              options={{ minimap: { enabled: false }, fontSize: 14 }}
            />
          </TabsContent>
        </Tabs>
      </form>
    </BaseDialog>
  );
}
