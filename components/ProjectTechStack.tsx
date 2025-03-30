"use client";

import { useState } from "react";
import ProjectTechStackCard from "@/components/ui/cards/ProjectTechStackCard";
import Image from "next/image";
import { techFields, techOptions } from "@/lib/staticAssets";
import { TechSelect } from "@/components/TechStackSelect";

export default function ProjectTechStack({
  initialData,
  onSave,
}: {
  initialData: Record<string, string>;
  onSave: (data: Record<string, string>) => void;
}) {
  const [form, setForm] = useState<Record<string, string>>(initialData);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(form);
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tech Stack</h2>
        <button
          onClick={() => setEditMode((prev) => !prev)}
          className="text-sm underline hover:text-blue-600"
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      {editMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {techFields.map(({ label, key }) => (
            <TechSelect
              key={key}
              label={label}
              value={form[key] || ""}
              options={techOptions[key]}
              onChange={(val: any) => handleChange(key, val)}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {techFields.map(({ label, key }) => {
            const value = form[key];
            const detail = techOptions[key]?.find((opt) => opt.tool === value);
            return (
              <ProjectTechStackCard
                key={key}
                item={{
                  key,
                  label,
                  tool: detail?.tool || "—",
                  language: detail?.language || "",
                  docs: detail?.docs || "",
                  icon: detail?.icon || "/icons/placeholder.svg",
                }}
              />
            );
          })}
        </div>
      )}

      {editMode && (
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Tech Stack
          </button>
        </div>
      )}
    </div>
  );
}
