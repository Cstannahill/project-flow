import { Project } from "./projects";

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

export interface SimplifiedSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string | null;
    selectedProjectId?: string | null;
  };
}

export interface UserPreferences {
  id: string;
  userId: string;
  prevProjectId?: string;
  theme?: string;
  language?: string;
  notificationsEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  emailVerified?: Date | null;
  image?: string;
  projects?: Project[];
  preferences?: UserPreferences;
}
