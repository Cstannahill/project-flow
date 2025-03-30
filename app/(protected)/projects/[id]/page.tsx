"use client";

import ProjectTechStack from "@/components/ProjectTechStack";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { techOptions } from "@/lib/staticAssets";
import type { TechItem } from "@/types/base";
import Image from "next/image";

export default function OverviewTab() {
  const [project, setProject] = useState<any>(null);
  const { id } = useParams();
  const handleSaveTechStack = async (stack: Record<string, string>) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
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
    if (!id) return;
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then(setProject);
  }, [id]);

  // useEffect(() => {
  //   console.log("techOptions", techOptions);
  //   Object.entries(techOptions).map(([category, tools]) =>
  //     tools.map(
  //       (tool) =>
  //         (tool.iconImg = (
  //           <span>
  //             <Image src={tool.icon} alt={tool.tool} width={24} height={24} />
  //           </span>
  //         ))
  //     )
  //   );
  //   console.log("techOptions", techOptions);
  // }, []);
  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="opacity-80 mt-2">{project.description}</p>
      <ProjectTechStack
        initialData={project.techStack}
        onSave={handleSaveTechStack}
      />
    </div>
  );
}
