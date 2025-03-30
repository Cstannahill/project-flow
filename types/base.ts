import React from "react";

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
