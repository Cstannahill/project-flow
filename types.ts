import React from "react";

export interface ComponentProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export type Feature = {
  id: string;
  title: string;
  description?: string;
  type: "Frontend" | "Backend" | "Database";
};
