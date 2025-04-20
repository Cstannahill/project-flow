// components/ui/dialogs/ApiRouteFormModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "@/lib/store/hooks";
import { createApiRoute, updateApiRoute } from "@/lib/store/apiRoutes/thunks";
import type { ApiRoute } from "@/types/entities/apiRoutes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";

export function ApiRouteFormModal({
  open,
  onCloseAction,
  existingRoute,
  projectId,
  onSubmitStart,
  onSubmitEnd,
}: {
  open: boolean;
  onCloseAction: () => void;
  existingRoute?: ApiRoute;
  projectId: string;
  onSubmitStart?: () => void;

  onSubmitEnd?: () => void;
}) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<ApiRoute>({
    id: existingRoute?.id || "",
    projectId,
    method: existingRoute?.method || "GET",
    path: existingRoute?.path || "",
    summary: existingRoute?.summary || "",
    description: existingRoute?.description || "",
    params: existingRoute?.params || {},
    query: existingRoute?.query || {},
    body: existingRoute?.body || {},
    responses: existingRoute?.responses || {},
    createdAt: existingRoute?.createdAt || new Date(),
    updatedAt: existingRoute?.updatedAt || new Date(),
  });

  useEffect(() => {
    if (existingRoute) setForm({ ...existingRoute, projectId });
  }, [existingRoute, projectId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }) as ApiRoute);
  };

  const handleSubmit = async () => {
    console.log(
      "🚀 ---------------------------------------------------------🚀",
    );
    console.log("🚀 ~ ApiRouteFormModal.tsx:61 ~ handleSubmit ~ form:", form);
    console.log(
      "🚀 ---------------------------------------------------------🚀",
    );

    if (onSubmitStart) onSubmitStart();
    try {
      if (form?.id) {
        // Pass the form directly as it already contains projectId
        await dispatch(updateApiRoute(form)).unwrap();
        toast.success("API Route updated successfully!");
      } else {
        // Pass the form directly, assuming createApiRoute expects the full object including projectId
        await dispatch(createApiRoute(form)).unwrap();
        toast.success("API Route created successfully!");
      }
      onCloseAction();
    } catch (e: any) {
      toast.error("Failed to save API route: " + e.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onCloseAction}>
      <DialogHeader>
        <h1 className="text-lg font-semibold text-gray-900">
          {existingRoute ? "Edit API Route" : "Create API Route"}
        </h1>
      </DialogHeader>
      <section className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="col-span-2">
            <Input
              name="path"
              value={form.path}
              onChange={handleChange}
              placeholder="/api/example"
              required
            />{" "}
            <Label className="mb-1 font-medium" htmlFor="path">
              {" "}
              Path
            </Label>
          </div>
          <div>
            <label className="mb-1 block font-medium">Method</label>
            <select
              name="method"
              value={form.method}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2 focus:border-blue-400 focus:ring-blue-400"
            >
              {(["GET", "POST", "PUT", "PATCH", "DELETE"] as const).map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <Input
              name="summary"
              value={form.summary}
              onChange={handleChange}
            />
            <Label className="mb-1 font-medium" htmlFor="summary">
              Summary
            </Label>
          </div>
          <div className="col-span-2">
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
            <Label className="mb-1 font-medium" htmlFor="description">
              Description
            </Label>
          </div>
          {/* future: add JSON editors or key-value lists here... */}
        </div>
      </section>
      <DialogFooter className="flex justify-end gap-2">
        {" "}
        <Button onClick={handleSubmit}>
          {existingRoute ? "Update" : "Create"}
        </Button>
        <Button color="secondary" onClick={onCloseAction}>
          Cancel
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
