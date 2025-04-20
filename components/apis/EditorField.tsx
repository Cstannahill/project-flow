"use client";

import React, { useState, FormEvent } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Option } from "@/components/ui/Option";
import safeStringify from "fast-safe-stringify";
import JsonEditor from "./JsonEditor";
import { Label } from "../ui/label";
import { Editor } from "@monaco-editor/react";
import { useAppDispatch } from "@/lib/store/hooks";
import {
  createApiRoute,
  rebuildOpenApiSpec,
  updateApiRoute,
} from "@/lib/store/apiRoutes";
import toast from "react-hot-toast";
import { useProjectId } from "@/hooks/useProjectId";
import { on } from "events";
import { Button } from "../ui/button";
import type { ApiRoutePayload } from "@/types/entities/apiRoutes";

export type FieldType = "text" | "textarea" | "select" | "hidden";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldConfig<T> {
  /** key in your data object */
  name: keyof T;
  /** human‑friendly label */
  label?: string;
  /** one of our supported input types */
  type: FieldType;
  /** only for selects */
  options?: FieldOption[];
  /** placeholder text */
  placeholder?: string;
  /** take up how many grid columns? */
  colSpan?: number;
}

export interface JsonDetailFormProps<T extends Record<string, any>> {
  id?: string;
  /** which tab is active initially, defaults to “details” */
  defaultTab?: "details" | "json";
  /** the field definitions */
  fields: FieldConfig<T>[];
  /** initial form data */
  initialData?: ApiRoutePayload;
  /** what to call when the form is successfully submitted */
  onSubmitAction: (data: T) => void;
  /** optional custom className on the form */
  className?: string;
}

/**
 * A generic form that renders a “Details” grid
 * of typed fields plus a “Raw JSON” editor
 */
export function JsonDetailForm<T extends Record<string, any>>({
  id = "json-detail-form",
  defaultTab = "details",
  fields,
  initialData = {} as ApiRoutePayload,
  onSubmitAction,
  className,
}: JsonDetailFormProps<T>) {
  const [tab, setTab] = useState<"details" | "json">(defaultTab);
  const [data, setData] = useState<ApiRoutePayload>(initialData);
  const dispatch = useAppDispatch();
  const projectId = useProjectId();
  function handleChange<K extends keyof T>(key: K, value: T[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }
  const handleChangeObject = (key: string, value: any) => {
    setData((d) => ({ ...d, [key]: value }));
  };

  async function handleSubmit() {
    console.log("🚀 ~ data:", data);
    onSubmitAction(data as ApiRoutePayload);
  }

  return (
    <form id={id} className={`space-y-6 ${className ?? ""}`} autoComplete="off">
      <TabsContent value="details">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => {
            const key = f.name as string;
            const span = f.colSpan ?? 1;
            const common = {
              id: key,
              name: key,
              value: data[key] ?? "",
              onChange:
                f.type === "select"
                  ? undefined
                  : (
                      e: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >,
                    ) => handleChange(f.name, e.target.value as any),
              placeholder: f.placeholder,
              className: `col-span-${span}`,
            };

            switch (f.type) {
              case "hidden":
                return <input key={key} type="hidden" {...common} />;

              case "text":
                return (
                  <div
                    key={key}
                    className={`flex flex-col gap-1 ${common.className}`}
                  >
                    {f.label && <label htmlFor={key}>{f.label}</label>}
                    <Input {...common} />
                  </div>
                );

              case "textarea":
                return (
                  <div
                    key={key}
                    className={`flex flex-col gap-1 ${common.className}`}
                  >
                    {f.label && <label htmlFor={key}>{f.label}</label>}
                    <Textarea {...common} rows={4} />
                  </div>
                );

              case "select":
                return (
                  <div
                    key={key}
                    className={`flex w-25 flex-col gap-1 ${common.className}`}
                  >
                    {f.label && <label htmlFor={key}>{f.label}</label>}
                    <Select
                      name={key}
                      value={String(data?.method ?? "")}
                      onValueChange={(val) => handleChange(f.name, val as any)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={f.placeholder || f.label} />
                      </SelectTrigger>
                      <SelectContent>
                        {f.options?.map((opt) => (
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

              default:
                return null;
            }
          })}
        </div>
      </TabsContent>

      <section className="grid grid-cols-2 grid-rows-2 gap-4 text-center">
        <div className="space-y-2 text-center">
          <Label className="mx-auto mt-2 justify-center">Request Params</Label>
          <Editor
            height="15vh"
            defaultLanguage="json"
            theme="vs-dark"
            value={JSON.stringify(data.params, null, 2)}
            onChange={(v) => {
              try {
                handleChange("params", JSON.parse(v || "{}"));
              } catch {
                // ignore until user fixes
              }
            }}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>
        <div className="space-y-2">
          <Label className="mx-auto mt-2 justify-center">Body</Label>
          <Editor
            height={"15vh"}
            defaultLanguage="json"
            theme="vs-dark"
            className="h-15[vh] bg-[#0b0b09]"
            value={JSON.stringify(data.body, null, 2)}
            onChange={(v) => {
              try {
                handleChange("body", JSON.parse(v || "{}"));
              } catch {}
            }}
          />
        </div>
        <div className="space-y-2">
          <Label className="mx-auto mt-2 justify-center">Query</Label>
          <Editor
            line={3}
            height="15vh"
            theme="vs-dark"
            defaultLanguage="json"
            value={JSON.stringify(data.query, null, 2)}
            onChange={(v) => {
              try {
                handleChange("query", JSON.parse(v || "{}"));
              } catch {}
            }}
          />
        </div>

        <div className="space-y-2">
          <Label className="mx-auto mt-2 justify-center">Responses</Label>
          <Editor
            height="15vh"
            defaultLanguage="json"
            theme="vs-dark"
            value={JSON.stringify(data.responses, null, 2)}
            onChange={(v) => {
              try {
                handleChange("responses", JSON.parse(v || "{}"));
              } catch {}
            }}
          />
        </div>
      </section>
      <Button
        onClick={() => onSubmitAction(data)}
        className="w-full"
        type="button"
      >
        Save
      </Button>
    </form>
  );
}
