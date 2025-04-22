// components/project/ProjectTabs.tsx
"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectedLayoutSegment } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  projectId: string;
}

export default function ProjectTabs({ projectId }: Props) {
  const segment = useSelectedLayoutSegment() ?? "overview";

  const navItems = [
    { value: "overview", label: "Overview", href: `/projects/${projectId}` },
    {
      value: "features",
      label: "Features",
      href: `/projects/${projectId}/features`,
    },
    {
      value: "diagrams",
      label: "Diagrams",
      href: `/projects/${projectId}/diagrams`,
    },
    {
      value: "databases",
      label: "Databases",
      href: `/projects/${projectId}/databases`,
    },
    { value: "apis", label: "API Routes", href: `/projects/${projectId}/apis` },
  ];

  return (
    <Tabs value={segment} className="w-full">
      <TabsList className="mx-auto flex w-3/4  border-b">
        {navItems.map(({ value, label, href }) => (
          <TabsTrigger
            key={value}
            value={value}
            asChild
            className={cn(
              "px-2 py-1 text-sm",
              "data-[state=active]:border-b-2 data-[state=active]:border-[#fbcd14] data-[state=active]:bg-[#1b1916]",
            )}
          >
            <Link href={href}>{label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
