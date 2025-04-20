// components/ProjectTechStack.tsx
"use client";

import { useState, useEffect } from "react";
import ProjectTechStackCard from "@/components/ui/cards/ProjectTechStackCard";
import { techFields, techOptions } from "@/lib/staticAssets";
import { TechSelect } from "@/components/TechStackSelect";
import TextInput from "@/components/ui/forms/inputs/TextInput";
import { P } from "./ui/Typography";

export interface ProjectTechStackProps {
  initialData: Record<string, string>;
  projectInfo: {
    projectId: string;
    title: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  /**
   * Called when the user clicks “Save Changes”.
   * Should return a Promise (e.g. dispatch(...).unwrap()).
   */
  onSave: (payload: {
    title: string;
    description?: string;
    techStack: Record<string, string>;
  }) => Promise<void>;
}

export default function ProjectTechStack({
  initialData,
  projectInfo,
  onSave,
}: ProjectTechStackProps) {
  const [editMode, setEditMode] = useState(false);
  const [info, setInfo] = useState({
    title: projectInfo.title,
    description: projectInfo.description ?? "",
  });
  const [form, setForm] = useState<Record<string, string>>(initialData);

  // sync if parent re‑renders with new projectInfo/initialData
  useEffect(() => {
    setInfo({
      title: projectInfo.title,
      description: projectInfo.description ?? "",
    });
    setForm(initialData);
  }, [projectInfo, initialData]);

  const handleInfoChange = (name: string, value: string) =>
    setInfo((prev) => ({ ...prev, [name]: value }));

  const handleChange = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    // pass back up to container
    await onSave({
      title: info.title,
      description: info.description,
      techStack: form,
    });
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <section>
        {editMode ? (
          <div className="space-y-4">
            <TextInput
              name="title"
              label="Project Title"
              value={info.title}
              valueChangeHandler={handleInfoChange}
            />
            <TextInput
              name="description"
              label="Project Description"
              value={info.description}
              valueChangeHandler={handleInfoChange}
            />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold">{info.title}</h1>
            {info.description && (
              <P className="opacity-80 mt-2">{info.description}</P>
            )}
          </div>
        )}
      </section>

      {/* Tech Stack Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tech Stack</h2>
        <button
          onClick={() => setEditMode((prev) => !prev)}
          className="text-sm underline hover:text-blue-600"
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Tech Stack Body */}
      {editMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {techFields.map(({ label, key }) => (
            <TechSelect
              key={key}
              label={label}
              value={form[key] || ""}
              options={techOptions[key]}
              onChange={(val: string) => handleChange(key, val)}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {techFields.map(({ label, key }) => {
            const tool = form[key];
            if (!tool) return null;
            const detail = techOptions[key].find((o) => o.tool === tool)!;
            return (
              <ProjectTechStackCard
                key={key}
                item={{ key, label, ...detail }}
              />
            );
          })}
        </div>
      )}

      {/* Save Button */}
      {editMode && (
        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
