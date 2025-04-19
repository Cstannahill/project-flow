// components/layout/TopNav.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { ThemeChanger } from "@/components/ThemeChanger";
import LogoutButton from "@/components/LogoutButton";
import clsx from "clsx";

const navItems = [
  { label: "Projects", href: "/dashboard" },
  { label: "AI Tools", href: "#" }, // placeholder
  { label: "Settings", href: "#" }, // placeholder
];

export default function TopNav() {
  return (
    <header
      className={clsx(
        "w-full flex items-center justify-between px-4 py-3 bg-radial-prime text-white shadow-md text-brand z-50"
      )}
    >
      <nav className="hidden md:flex items-center gap-6">
        {navItems.map(({ label, href }, index) => (
          <Link
            key={href + "top" + label + index}
            href={href}
            className={
              href !== "#"
                ? "text-sm font-bold hover:text-white/80 border border-rounded rounded-lg p-1 brand-border dark:text-brand"
                : "text-sm text-white/50 disabled"
            }
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icons/shadyt-logo.png"
            alt="Logo"
            width={36}
            height={36}
            className="rounded-xl border border-white/20"
          />
          <span className="font-bold text-lg tracking-tight">shadyt-ui</span>
        </Link>
      </div>
      <div className="hidden md:flex items-center gap-3">
        <ThemeChanger />
        <LogoutButton />
      </div>
    </header>
  );
}
