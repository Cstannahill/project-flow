import { useContext } from "react";
import { ProjectIdContext } from "@/components/wrappers/ProjectContextProvider";

export function useProjectId() {
  const id = useContext(ProjectIdContext);
  if (!id) {
    throw new Error("useProjectId must be used within a ProjectProvider");
  }
  return id;
}
