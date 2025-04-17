"use client";

import { useState, type InputHTMLAttributes } from "react";
import ProjectTechStackCard from "@/components/ui/cards/ProjectTechStackCard";
import Image from "next/image";
import { techFields, techOptions } from "@/lib/staticAssets";
import { TechSelect } from "@/components/TechStackSelect";
import TextInput from "./ui/forms/TextInput";

type ProjectInfo = {
  title: string;
  description: string;
};
export default function ProjectTechStack({
  initialData,
  projectInfo,
  onSave,
}: {
  initialData: Record<string, string>;
  projectInfo: ProjectInfo;
  onSave: (data: Record<string, string>) => void;
}) {
  const [info, setInfo] = useState(projectInfo);
  const [form, setForm] = useState<Record<string, string>>(initialData);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleInfoChange = (name: string, value: string) => {
    setInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(form);
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      {!editMode ? (
        <div>
          <h1 className="text-3xl font-bold">{projectInfo?.title || ""}</h1>
          <p className="opacity-80 mt-2">{projectInfo?.description}</p>
        </div>
      ) : (
        <div>
          <TextInput
            name="title"
            label="Project Title"
            autoComplete="project-name"
            value={info.title}
            onValueChange={handleInfoChange}
          />
          <TextInput
            autoComplete="project-description"
            name="description"
            label="Project Description"
            value={info.description}
            onValueChange={handleInfoChange}
          />
        </div>
      )}
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
          {techFields &&
            techFields?.length > 0 &&
            techFields?.map(({ label, key }) => (
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
          {techFields &&
            techFields?.length > 0 &&
            techFields?.map(({ label, key }) => {
              if (!form[key]) return null;
              const value = form[key];
              const detail = techOptions[key]?.find(
                (opt) => opt.tool === value
              );
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
