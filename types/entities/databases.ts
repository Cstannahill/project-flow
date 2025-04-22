export type RelationshipType =
  | "OneToOne"
  | "OneToMany"
  | "ManyToOne"
  | "ManyToMany";

export type Relationship = {
  fromTable?: string;
  toTable?: string;
  fromColumn?: string;
  toColumn?: string;
  source: string;
  target: string;
  type: RelationshipType;
};
export type Column = {
  name: string;
  type: string;
  isPrimary?: boolean;
  isNullable?: boolean;
  isUnique?: boolean;
};

export type Table = {
  id?: string;
  name: string;
  columns: Column[];
};

export type SchemaData = {
  id?: string;
  projectId?: string;
  title?: string;
  name?: string;
  tables: Table[];
  relationships: Relationship[];
};

export interface DatabaseSchema {
  id: string;
  projectId: string;
  title: string;
  data: SchemaData;
  createdAt: Date;
  updatedAt: Date;
}
