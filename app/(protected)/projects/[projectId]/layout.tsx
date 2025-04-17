import Link from "next/link";
import { ProjectLayoutProps } from "@/types/base";

export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { projectId } = await params;

  const navItems = [
    { label: "Overview", href: `/projects/${projectId}` },
    { label: "Features", href: `/projects/${projectId}/features` },
    { label: "Diagrams", href: `/projects/${projectId}/diagrams` },
    { label: "Databases", href: `/projects/${projectId}/databases` },
    { label: "API Routes", href: `/projects/${projectId}/apis` },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <nav className="flex gap-4 border-b pb-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium hover:text-blue-400 active:text-blue-900 focus:text-blue-700"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div>{children}</div>
    </div>
  );
}
