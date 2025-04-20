"use client";

import { createContext, useContext, type ReactNode, useEffect } from "react";

export const ProjectIdContext = createContext<string>("");

export default function ProjectProvider({
  projectId,
  children,
}: {
  projectId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    localStorage.setItem("lastProjectId", projectId);
  }, [projectId]);

  return (
    <ProjectIdContext.Provider value={projectId}>
      {children}
    </ProjectIdContext.Provider>
  );
}
