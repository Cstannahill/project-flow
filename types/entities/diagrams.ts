export interface Diagram {
  id: string;
  projectId: string;
  title: string;
  content?: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
