// components/layout/TopNav.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { ThemeChanger } from "@/components/ThemeChanger";
import LogoutButton from "@/components/LogoutButton";
import clsx from "clsx";
import { useAppSelector } from "@/lib/store/hooks";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Projects", href: "/dashboard" },
  { label: "AI Tools", href: "#" }, // placeholder
  { label: "Settings", href: "#" }, // placeholder
];

export default function TopNav() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  return (
    <header
      className={clsx(
        "bg-radial-prime text-brand z-50 flex w-full items-center justify-between px-4 py-3 text-white shadow-md",
      )}
    >
      <nav className="hidden items-center gap-6 md:flex">
        {navItems.map(({ label, href }, index) => (
          <Link
            key={href + "top" + label + index}
            href={href}
            className={
              href !== "#"
                ? "border-rounded brand-border dark:text-brand rounded-lg border p-1 text-sm font-bold hover:text-white/80"
                : "disabled text-sm text-white/50"
            }
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/icons/shadytlogo/st1024-main.png"
            alt="Logo"
            width={36}
            height={36}
            className="rounded-xl border border-white/20"
          />
          <span className="text-lg font-bold tracking-tight">shadyt-ui</span>
        </Link>
      </div>
      <div className="hidden items-center gap-3 md:flex">
        {/* <ThemeChanger /> */}
        <button className="ripple btn-sm rounded bg-cyan-600 ">Click</button>
        {currentUser ? (
          <LogoutButton />
        ) : (
          <Link href="/login">
            {" "}
            <button className="text-md rounded bg-white/10 px-3 py-1 font-medium hover:bg-white/20">
              Login{" "}
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
