"use client";

import { useState } from "react";
import type { Feature } from "@/types";
import safeStringify from "fast-safe-stringify";

interface Props {
  onCloseAction: () => void;
  onSaveAction: (feature: Feature) => void;
  initialData?: Feature | null;
}

export default function CreateFeatureModal({
  onCloseAction,
  onSaveAction,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"frontend" | "backend" | "database">(
    "frontend",
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/features", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: safeStringify({ title, description, type }),
    });

    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      onSaveAction(data);
      onCloseAction();
    } else {
      console.error(data.error);
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Add New Feature</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full rounded border p-2"
            placeholder="Feature Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full rounded border p-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            className="w-full rounded border p-2"
            value={type}
            onChange={(e) => setType(e.target.value as any)}
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
          </select>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCloseAction}
              className="rounded bg-gray-200 px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={(e) => (setLoading(true), e.preventDefault())}
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
