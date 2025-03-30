"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const typeOptions = ["Frontend", "Backend", "API", "Database"];
const statusOptions = ["Planned", "In Progress", "Complete"];
const predefinedTags = ["MVP", "Bug", "UI", "UX", "Enhancement"];

const tagColors: Record<string, string> = {
  MVP: "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
  Bug: "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300",
  UI: "bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300",
  UX: "bg-indigo-100 text-indigo-800 dark:bg-indigo-800/20 dark:text-indigo-300",
  Enhancement:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300",
};

const statusColors: Record<string, string> = {
  Planned: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100",
  "In Progress":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300",
  Complete:
    "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300",
};

type SortableFeatureCardProps = {
  feature: {
    id: string;
    title: string;
    description?: string;
    type: string;
    status?: string;
    tags?: string[];
  };
  onDelete?: (id: string) => void;
  onEdit?: (updated: any) => void;
  isNew?: boolean;
  projectId?: string;
};

export default function SortableFeatureCard({
  feature,
  onDelete,
  onEdit,
  isNew = false,
  projectId,
}: SortableFeatureCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: feature.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isEditing, setIsEditing] = useState(isNew);
  const [form, setForm] = useState({
    title: feature.title || "",
    description: feature.description || "",
    type: feature.type || "Frontend",
    status: feature.status || "",
    tags: feature.tags || [],
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    let updated;

    if (isNew && projectId) {
      const res = await fetch(`/api/projects/${projectId}/features`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      updated = await res.json();
    } else {
      const res = await fetch(
        `/api/projects/${projectId}/features/${feature.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      updated = await res.json();
    }

    setSaving(false);
    setIsEditing(false);
    onEdit?.(updated);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition group"
    >
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full border p-2 rounded bg-transparent"
            placeholder="Feature title"
          />
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="w-full border p-2 rounded bg-transparent"
            placeholder="Feature description"
          />
          <select
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className="border p-2 rounded bg-transparent"
          >
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={form.status || ""}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            className="border p-2 rounded bg-transparent"
          >
            <option value="">Set status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex flex-wrap gap-2">
              {predefinedTags.map((tag) => {
                const selected = form.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        tags: selected
                          ? f.tags.filter((t) => t !== tag)
                          : [...f.tags, tag],
                      }))
                    }
                    className={`text-xs px-2 py-1 rounded-full border ${
                      selected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-transparent text-gray-600 dark:text-gray-300 border-gray-300 dark:border-neutral-600"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              placeholder="Add custom tag"
              className="border mt-2 p-1 px-2 rounded text-sm bg-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const newTag = e.currentTarget.value.trim();
                  if (newTag && !form.tags.includes(newTag)) {
                    setForm((f) => ({ ...f, tags: [...f.tags, newTag] }));
                  }
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setIsEditing(false);
                if (isNew) onDelete?.(feature.id);
              }}
              className="text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm opacity-70 mt-1">{feature.description}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {feature.status && (
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      statusColors[feature.status] ??
                      "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100"
                    }`}
                  >
                    {feature.status}
                  </span>
                )}

                {(feature.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      tagColors[tag] ??
                      "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div
              {...listeners}
              {...attributes}
              title="Drag to reorder"
              className="cursor-grab p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <Bars3Icon className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <span
              className={`px-2 py-1 text-xs rounded-full capitalize ${
                feature.type === "Frontend"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300"
                  : feature.type === "Backend"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300"
                  : "bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300"
              }`}
            >
              {feature.type}
            </span>

            <div className="flex gap-4 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                title="Edit feature"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <PencilSquareIcon className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  if (
                    confirm("Are you sure you want to delete this feature?")
                  ) {
                    await fetch(`/api/projects/${projectId}/features`, {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ featureId: feature.id }),
                    });
                    onDelete?.(feature.id);
                  }
                }}
                title="Delete feature"
                className="flex items-center gap-1 text-sm text-red-600 hover:underline"
              >
                <TrashIcon className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
