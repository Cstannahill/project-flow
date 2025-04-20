import React, { ReactNode } from "react";

export interface ComponentProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export type ProjectLayoutProps = {
  children: ReactNode;
  params: Promise<{ projectId: string }>;
};
