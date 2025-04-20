import type { ProjectSummary } from "./projects";

export interface TechStack {
  frontend?: string;
  backend?: string;
  database?: string;
  cssframework?: string;
  authProvider?: string;
  hosting?: string;
  apiStyle?: string;
  stateManagement?: string;
}

export type TechItem = {
  key: string;
  label: string;
  icon: string; // path to imported SVG or public image
  iconImg?: React.ReactNode;
  tool: string;
  language: string;
  docs: string;
};

export interface ProjectTechStackProps {
  initialData: Record<string, string> | null;
  projectInfo: ProjectSummary;
}
