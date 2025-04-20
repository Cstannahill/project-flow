"use client";

import { useState, useEffect, ReactNode, KeyboardEvent } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/ui/dialogs/DeleteConfirmationDialog";
import type { Feature } from "@/types/entities/features";
import {
  tagColors,
  statusColors,
  typeOptions,
  predefinedTags,
  statusOptions,
  typeColors,
} from "@/lib/staticAssets";
import { P } from "../Typography";

// Preset tag & status color mappings

interface FeatureCardProps {
  feature: Feature;
  projectId: string;
  onEditAction: (updated: Feature) => void;
  onDelete?: (id: string) => void;
  isNew?: boolean;
  children?: ReactNode;
}

export default function FeatureCard({
  feature,
  projectId,
  onEditAction,
  onDelete,
  isNew = false,
  children,
}: FeatureCardProps) {
  const [isEditing, setIsEditing] = useState(isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: feature.title || "",
    description: feature.description || "",
    type: feature.type || "Frontend",
    status: feature.status || "Planned",
    tags: feature.tags || [],
  });

  // Sync when feature prop changes (e.g. after external update)
  useEffect(() => {
    setForm({
      title: feature.title,
      description: feature.description || "",
      type: feature.type,
      status: feature.status || "Planned",
      tags: feature.tags || [],
    });
  }, [feature]);

  const handleSave = async () => {
    setSaving(true);
    // delegate persistence to parent via onEditAction
    try {
      await onEditAction({ ...feature, ...form, projectId });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  if (isEditing) {
    return (
      <div className="border rounded-lg p-4 bg-white dark:bg-neutral-900 shadow-sm">
        <div className="space-y-3">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Feature title"
            className="w-full border p-2 rounded bg-transparent"
            onKeyDown={handleKeyDown}
          />
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            placeholder="Description (optional)"
            className="w-full border p-2 rounded bg-transparent"
            onKeyDown={handleKeyDown}
          />
          <div className="flex gap-2">
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="border p-2 rounded bg-transparent flex-1"
            >
              {Object.keys(typeColors)
                .filter((k) => k !== "default")
                .map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
            </select>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value }))
              }
              className="border p-2 rounded bg-transparent flex-1"
            >
              {Object.keys(statusColors).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              onClick={() => {
                setIsEditing(false);
                if (isNew) onDelete?.(feature.id);
              }}
              variant="outline"
              className="text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="text-sm"
              variant={"outline"}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Display mode
  return (
    <div className="border rounded-lg p-4  shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{feature.title}</h3>
          {feature.description && (
            <P className="text-sm opacity-70 mt-1">{feature.description}</P>
          )}
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="text-gray-500 hover:text-brand00 p-1"
          title="Edit feature"
        >
          <PencilSquareIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {feature.status && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              statusColors[feature.status]
            }`}
          >
            {feature.status}
          </span>
        )}
        {(feature.tags ?? []).map((tag) => (
          <span
            key={tag}
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              tagColors[tag] ?? "bg-gray-100 text-brand"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-3 flex justify-between items-center">
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            typeColors[feature.type] ?? typeColors.default
          }`}
        >
          {feature.type}
        </span>
        <div>{children /* delete dialog trigger passed as child */}</div>
      </div>
    </div>
  );
}
