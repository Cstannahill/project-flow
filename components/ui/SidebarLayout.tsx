// components/layout/SidebarLayout.tsx
"use client";

import type { ReactNode } from "react";
import Navbar from "@/components/ui/Navbar";

interface SidebarLayoutProps {
  children: ReactNode;
  sidebarItems?: { label: string; href: string }[];
}

export default function SidebarLayout({
  children,
  sidebarItems = [],
}: SidebarLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-6 border-r border-white/10">
        <Navbar menuItems={sidebarItems} layout="side" />
      </aside>
      <main className="flex-1 p-6">{children}</main>{" "}
    </div>
  );
}
