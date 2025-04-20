"use client";
import Editor from "@monaco-editor/react";
import { Label } from "../ui/label";
import { useState } from "react";
import { H5 } from "../ui/Typography";
import type {
  ApiRouteCreatePayload,
  ApiRoutePayload,
} from "@/types/entities/apiRoutes";
type JsonEditorProps = {
  data: Partial<ApiRoutePayload>;
};
const JsonEditor = (props: JsonEditorProps) => {
  const [form, setForm] = useState({
    params: props.data.params || {},
    query: props.data.query || {},
    body: props.data.body || {},
    responses: props.data.responses || {},
  });
  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <>
      <section className="grid grid-cols-2 grid-rows-2 gap-4 text-center">
        <div className="space-y-2 text-center">
          <Label className="mx-auto mt-2 justify-center">Request Params</Label>
          <Editor
            height="15vh"
            defaultLanguage="json"
            theme="vs-dark"
            value={JSON.stringify(form.params, null, 2)}
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
            value={JSON.stringify(form.body, null, 2)}
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
            value={JSON.stringify(form.query, null, 2)}
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
            value={JSON.stringify(form.responses, null, 2)}
            onChange={(v) => {
              try {
                handleChange("responses", JSON.parse(v || "{}"));
              } catch {}
            }}
          />
        </div>
      </section>
    </>
  );
};
export default JsonEditor;
