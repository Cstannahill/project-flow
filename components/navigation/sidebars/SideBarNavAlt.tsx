"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";
import { selectFeaturesByProject } from "@/lib/store/features";
import { selectDiagramsByProject } from "@/lib/store/diagrams";
import { selectApiRoutesByProject } from "@/lib/store/apiRoutes";
import {
  Bot,
  ChartArea,
  Database,
  Frame,
  SquareTerminal,
  Server,
  CircuitBoard,
  FolderRoot,
} from "lucide-react";

import {
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarInset,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "@/components/team-switcher";
import { NavUser } from "@/components/nav-user";
import { NavMain } from "@/components/nav-main";
import { selectDatabasesByProject } from "@/lib/store/databases";
import { DashboardButton } from "../DashboardButton";
import type { Project } from "@/types/entities/projects";

export default function SideNavBarAlt() {
  const { projectId } = useParams() as { projectId?: string };

  // 1️⃣ grab each slice, default to empty array
  const features =
    useAppSelector((s) => selectFeaturesByProject(s, projectId ?? "")) ?? [];
  const diagrams =
    useAppSelector((s) => selectDiagramsByProject(s, projectId ?? "")) ?? [];
  const apiRoutes =
    useAppSelector((s) => selectApiRoutesByProject(s, projectId ?? "")) ?? [];
  const projects = useAppSelector((s) => s.projects.projects) ?? [];
  const databaseSchemas =
    useAppSelector((s) => selectDatabasesByProject(s, projectId ?? "")) ?? [];
  const featuresBase = [
    {
      title: "Features Overview",
      url: `/projects/${projectId}/features`,
    },
  ];
  const featuresItems = features.map((f) => ({
    title: f?.title || "Untitled feature",
    url: `/projects/${projectId}/features/${f.id}`,
  }));
  const diagramsBase = [
    {
      title: "Diagrams Overview",
      url: `/projects/${projectId}/diagrams`,
    },
  ];
  const diagramsItems = diagrams.map((d) => ({
    title: d?.title || "Untitled diagram",
    url: `/projects/${projectId}/diagrams/${d.id}`,
  }));
  const apiRoutesBase = [
    {
      title: "API Routes Overview",
      url: `/projects/${projectId}/apis`,
    },
  ];
  const apiRoutesItems = apiRoutes.map((r) => ({
    title: `${r.method?.toUpperCase() ?? "GET"} ${r.path ?? "/"}`,
    url: `/projects/${projectId}/apis/${r.id}`,
  }));
  const databaseSchemasBase = [
    {
      title: "Database Schemas Overview",
      url: `/projects/${projectId}/databases`,
    },
  ];
  const databaseSchemasItems = databaseSchemas.map((d) => ({
    title: d?.title || "Untitled schema",
    url: `/projects/${projectId}/databases/${d.id}`,
  }));
  const projectsBase = [
    {
      name: "Projects Overview",
      url: `/dashboard`,
      logo: SquareTerminal,
    },
  ];
  const projectsItems = projects.map((p: Project) => ({
    name: p?.title || "Untitled project",
    url: `/projects/${p.id}`,
    logo: FolderRoot,
  }));

  const featuresList = [...featuresBase, ...featuresItems];
  // 2️⃣ build the NavMain data
  const databaseSchemasList = [...databaseSchemasBase, ...databaseSchemasItems];
  const projectsList = [...projectsBase, ...projectsItems];
  const diagramsList = [...diagramsBase, ...diagramsItems];
  const apiRoutesList = [...apiRoutesBase, ...apiRoutesItems];
  const navItems = [
    {
      title: "Features",
      icon: Bot,
      url: `/projects/${projectId}/features`,
      items: featuresList,
    },
    {
      title: "Database Schemas",
      icon: Database,
      url: `/projects/${projectId}/databases`,
      items: databaseSchemasList,
    },
    {
      title: "Diagrams",
      icon: ChartArea,
      url: `/projects/${projectId}/diagrams`,
      items: diagramsList,
    },
    {
      title: "APIs",
      icon: Server,
      url: `/projects/${projectId}/apis`,
      items: apiRoutesList,
    },
  ];

  return (
    <SidebarProvider className="fixed inset-y-0 left-0 z-80 hidden w-64 overflow-y-auto border-r border-brand-text-secondary bg-surface backdrop-blur lg:block">
      <SidebarHeader>
        <TeamSwitcher teams={projectsList} />
        {/* <DashboardButton /> */}
      </SidebarHeader>

      <SidebarContent>
        {/* 3️⃣ feed dynamic items into your collapsible NavMain */}
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarInset>
        <SidebarTrigger />
        <SidebarSeparator orientation="vertical" />
        <NavUser
          user={{
            name: "Christian",
            email: "ctan.dev@gmail.com",
            avatar:
              "https://ctandevstorage.blob.core.windows.net/images/picture.jpeg",
          }} /* your user menu */
        />
      </SidebarInset>

      <SidebarRail />
    </SidebarProvider>
  );
}
