import { TechStack } from "./techStack";
import { Feature } from "./features";
import { Diagram } from "./diagrams";
import { DatabaseSchema } from "./databases";
import { ApiRoute } from "./apiRoutes";
export interface Project {
  id: string;
  title?: string;
  description?: string;
  techStack?: Record<string, string>;
  features?: Feature[];
  diagrams?: Diagram[];
  schema?: DatabaseSchema[];
  apiRoutes?: ApiRoute[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSummary {
  projectId: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectProps {
  id: string;
  title: string;
  description?: string;
  techStack?: Record<string, string>;
  schemas?: DatabaseSchema[];
  apiRoutes?: ApiRoute[];
  selectProjectHandler: (id: string) => void;
  createdAt: Date;
  updatedAt: Date;
}
