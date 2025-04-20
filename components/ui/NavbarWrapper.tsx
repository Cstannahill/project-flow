// components/layout/NavbarWrapper.tsx
"use client";
import { usePathname, useParams } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import { useEffect } from "react";

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  let { projectId } = useParams();
  const pathname = usePathname();
  const [pId, setPId] = useState<string | null>(null);
  const [navItems, setNavItems] = useState([{ label: "Home", href: "/" }]);

  const buildNavItems = (projectId: string) => {
    return [
      { label: "Home", href: "/" },
      { label: "Projects", href: "/dashboard" },
      {
        label: "View Project Overview",
        href: `/projects/${projectId}`,
      },
      {
        label: "Project Features",
        href: `/projects/${projectId}`,
      },
      {
        label: "Project DBs",
        href: `/projects/${projectId}/databases`,
      },
      {
        label: "Diagrams",
        href: `/projects/${projectId}/diagrams`,
      },
      {
        label: "APIs",
        href: `/projects/${projectId}/apis`,
      },
    ];
  };
  useEffect(() => {
    if (!projectId) return;
    if (Array.isArray(projectId)) {
      projectId = projectId[0];
    }
    const newNavItems = buildNavItems(projectId);
    setNavItems(newNavItems);
    setPId(projectId);
  }, [projectId]);

  // const isSidebarRoute =
  //   pathname.startsWith("/dashboard") || pathname.startsWith("/project");

  // if (isSidebarRoute) {
  //   return <SidebarLayout sidebarItems={navItems}>{children}</SidebarLayout>;
  // }

  return (
    <>
      <Navbar menuItems={navItems} layout="top" />
      <main>{children}</main>
    </>
  );
}
