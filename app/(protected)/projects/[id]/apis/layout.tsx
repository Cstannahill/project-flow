import Link from "next/link";
import { ProjectLayoutProps } from "@/types/base";

export default async function APILayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { id } = await params;

  const navItems = [
    { label: "API Routes", href: `/projects/${id}/apis` },
    { label: "OpenAPI-Spec", href: `/projects/${id}/apis/openapi-spec` },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-1 space-y-6">
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
