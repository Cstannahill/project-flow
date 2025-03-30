// app/projects/[id]/layout.tsx
// "use client";
import Link from "next/link";
import { ReactNode } from "react";

export default async function ProjectLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string };
}) {
  const { id } = await params;

  const navItems = [
    { label: "Overview", href: `/projects/${id}` },
    { label: "Features", href: `/projects/${id}/features` },
    { label: "Diagrams", href: `/projects/${id}/diagrams` },
    { label: "Databases", href: `/projects/${id}/databases` },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <nav className="flex gap-4 border-b pb-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium hover:text-blue-600"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div>{children}</div>
    </div>
  );
}
