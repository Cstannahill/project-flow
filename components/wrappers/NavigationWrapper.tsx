// components/layout/NavigationWrapper.tsx
"use client";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TopNav from "../navigation/TopNav";
import SideNav from "../navigation/SideNav";

export default function NavigationWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { projectId: rawProjectId } = useParams();
  const pathname = usePathname();
  const [navItems, setNavItems] = useState([{ label: "Home", href: "/" }]);

  const projectId = Array.isArray(rawProjectId)
    ? rawProjectId[0]
    : rawProjectId;

  useEffect(() => {
    if (!projectId) return;
    setNavItems([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Overview", href: `/projects/${projectId}` },
      { label: "Features", href: `/projects/${projectId}/features` },
      { label: "Databases", href: `/projects/${projectId}/databases` },
      { label: "Diagrams", href: `/projects/${projectId}/diagrams` },
      { label: "API Routes", href: `/projects/${projectId}/apis` },
    ]);
  }, [projectId]);

  const sidebarActive =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/projects");

  return (
    <>
      <TopNav />
      <main className="flex">
        {sidebarActive && <SideNav items={navItems} />}
        <section className="flex-1 px-4 py-4">{children}</section>
      </main>
    </>
  );
}
