import React, { ReactNode } from "react";

export interface ComponentProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
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

export type Column = {
  name: string;
  type: string;
  isPrimary?: boolean;
  isNullable?: boolean;
  isUnique?: boolean;
};

export type Relationship = {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: "OneToOne" | "OneToMany" | "ManyToMany";
};

export type Table = {
  name: string;
  columns: Column[];
};

export type SchemaData = {
  tables: Table[];
  relationships: Relationship[];
};

export type RelationshipType =
  | "OneToOne"
  | "OneToMany"
  | "ManyToOne"
  | "ManyToMany";

export type ProjectLayoutProps = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRoute = {
  id: string;
  projectId: string;

  method: HttpMethod;
  path: string;

  summary: string;
  description?: string;

  params?: Record<string, any>; // For path parameters
  query?: Record<string, any>; // For query parameters
  body?: Record<string, any>; // For request body schema
  responses?: Record<string, any>; // For response schema

  createdAt: Date;
  updatedAt: Date;
};

export type ApiRoutePayload = {
  id?: string;
  projectId?: string;
  method: HttpMethod;
  path: string;
  summary: string;
  description?: string;
  params?: Record<string, any>;
  query?: Record<string, any>;
  body?: Record<string, any>;
  responses?: Record<string, any>;
};
