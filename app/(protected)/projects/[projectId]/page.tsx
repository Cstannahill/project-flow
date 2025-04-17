"use client";

import ProjectTechStack from "@/components/ProjectTechStack";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { techOptions } from "@/lib/staticAssets";
import type { TechItem } from "@/types/base";
import Image from "next/image";
import css from "styled-jsx/css";

export default function OverviewTab() {
  const [project, setProject] = useState<any>(null);
  const { projectId } = useParams();
  const handleSaveTechStack = async (stack: Record<string, string>) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stack }),
      });

      if (!res.ok) {
        throw new Error("Failed to save tech stack");
      }

      console.log("Tech stack saved *toast!");
    } catch (err) {
      console.error(err);
      alert("Error saving tech stack.");
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/projects/${projectId}`)
      .then((res) => res.json())
      .then(setProject);
  }, [projectId]);

  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <ProjectTechStack
        initialData={
          project?.techStack || {
            frontend: "",
            backend: "",
            database: "",
            css: "",
            hosting: "",
            auth: "",
            stateManagement: "",
            api: "",
          }
        }
        projectInfo={{ title: project.title, description: project.description }}
        onSave={handleSaveTechStack}
      />
    </div>
  );
}
