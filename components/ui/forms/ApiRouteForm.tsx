"use client";

import { useState, type FormEvent } from "react";
import { ApiRoutePayload, ApiRoute } from "@/types/base"; // Update this path if needed
import { useAppSelector } from "@/lib/store/hooks"; // Update this path if needed
import { selectCurrentProjectId } from "@/lib/store/selectors";
import { ToastContainer, toast } from "react-toastify";
import { on } from "events";
// import "react-toastify/dist/ReactToastify.css";

type ApiRouteFormProps = {
  initialData?: ApiRoutePayload;
  onCancel: () => void;
  updateRouteUI: () => Promise<void>;
};

const defaultMethodOptions = ["GET", "POST", "PATCH", "PUT", "DELETE"];
const defaultApiRoutePayload: ApiRoutePayload = {
  method: "GET",
  path: "",
  summary: "",
  description: "",
  params: {},
  query: {},
  body: {},
  responses: {},
};

export default function ApiRouteForm({
  initialData = defaultApiRoutePayload,
  onCancel,
  updateRouteUI,
}: ApiRouteFormProps) {
  const [form, setForm] = useState<ApiRoutePayload>({
    id: initialData.id || "",
    projectId: initialData.projectId || "",
    method: initialData.method || "GET",
    path: initialData.path || "",
    summary: initialData.summary || "",
    description: initialData.description || "",
    params: initialData.params || {},
    query: initialData.query || {},
    body: initialData.body || {},
    responses: initialData.responses || {},
  });
  const projectId = useAppSelector(selectCurrentProjectId);
  const handleAddRoute = async (newRoute: any) => {
    const res = await fetch(`/api/projects/${projectId}/apis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRoute),
    });
    // await fetchRoutes();
    // await fetchSpecUrl();
  };

  const handleChange = (
    field: keyof ApiRoutePayload,
    value: string | Record<string, any>
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleSaveRoute = async (updatedRoute: ApiRoutePayload) => {
    const apiPath = `/api/projects/${projectId}/apis/${updatedRoute.id}`;
    console.log("Incoming Route - Save");
    console.log(apiPath);
    console.table(updatedRoute);
    const res = await fetch(
      `/api/projects/${projectId}/apis/${updatedRoute.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRoute),
      }
    );

    if (res.ok) {
      const saved = await res.json();
      const updateOpenAPIApec = await fetch(
        `/api/projects/${projectId}/openapi-spec/rebuild/route`
      );
      if (updateOpenAPIApec.ok) {
        toast("Open API-spec saved!");
      } else {
        toast("Failed to update Open API-spec", { type: "error" });
      }
    }
  };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // const forms = event.currentTarget
    // const formElements = form.elements as typeof form.elements
    if (form?.id && form?.id !== "") {
      handleSaveRoute(form);
    } else {
      handleAddRoute(form);
    }
    updateRouteUI();
    toast("Route saved successfully!");
    // Reset the form after submission
    setForm(defaultApiRoutePayload);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium">Path</label>
          <input
            type="text"
            value={form.path}
            onChange={(e) => handleChange("path", e.target.value)}
            required
            placeholder="/api/example"
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Method</label>
          <select
            value={form.method}
            onChange={(e) => handleChange("method", e.target.value)}
            className="border px-3 py-2 rounded"
          >
            {defaultMethodOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Summary</label>
        <input
          type="text"
          value={form.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* JSON inputs could eventually be replaced with structured editors */}
      <div className="grid sm:grid-cols-2 gap-4">
        {["params", "query", "body", "responses"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium capitalize">
              {field}
            </label>
            <textarea
              rows={3}
              value={JSON.stringify(
                form[field as keyof ApiRoutePayload] || {},
                null,
                2
              )}
              onChange={(e) =>
                handleChange(
                  field as keyof ApiRoutePayload,
                  JSON.parse(e.target.value || "{}")
                )
              }
              className="w-full font-mono text-sm border px-3 py-2 rounded"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}
