"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import DarkModeToggle from "./DarkModeToggle";
import { useAppSelector } from "@/lib/store/hooks";
import LogoutButton from "../LogoutButton";
type NavbarProps = {
  layout?: "top" | "side";
};

export default function Navbar({ layout = "top" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const user = useAppSelector((state) => state.user.currentUser);
  const navItemsNoUser = [
    { label: "Home", href: "/" },
    { label: "Login", href: "/login" },
    { label: "Signup", href: "/signup" },
  ];

  const navItemsUser = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  const isTop = layout === "top";

  return (
    <nav
      className={clsx(
        "z-10 backdrop-blur-md transition-all duration-300",
        "bg-white/70 dark:bg-gray-900/70 shadow-md",
        isTop
          ? "sticky top-0 left-0 h-auto w-full"
          : "fixed top-0 left-0 h-full w-64 border-r border-gray-200 dark:border-gray-700"
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-between",
          isTop ? "px-6 py-4" : "flex-col h-full px-4 py-6"
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="font-bold">
            {" "}
            Project Flow:{"   "}
            <span className="text-sm font-bold">{user?.name || "Unknown"}</span>
          </span>
        </div>

        {/* Mobile Toggle */}
        {isTop && (
          <button
            className="md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}

        {/* Nav Items */}
        <ul
          className={clsx(
            "text-sm font-medium",
            isTop
              ? "hidden md:flex gap-6 text-gray-800 dark:text-gray-100 items-center"
              : "flex flex-col-reverse gap-4 mb-auto mt-4 w-full items-center text-gray-800 dark:text-gray-100"
          )}
        >
          {/* {user && user?.name != null && <LogoutButton />} */}
          {user && user?.name != null
            ? navItemsUser.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(
                        "transition-colors px-2 py-1 rounded",
                        isActive
                          ? "text-blue-600 dark:text-blue-400 font-semibold"
                          : "hover:text-blue-600 dark:hover:text-blue-400"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })
            : navItemsNoUser.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={clsx(
                        "transition-colors px-2 py-1 rounded",
                        isActive
                          ? "text-blue-600 dark:text-blue-400 font-semibold"
                          : "hover:text-blue-600 dark:hover:text-blue-400"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
          {user && user?.name != null && (
            <li>
              <LogoutButton />
            </li>
          )}
          <DarkModeToggle />
        </ul>
      </div>

      {/* Mobile Menu (only top layout) */}
      {isTop && isOpen && (
        <ul className="md:hidden px-6 pb-4 flex flex-col gap-4 text-sm font-medium text-gray-800 dark:text-gray-100">
          {navItemsUser.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "transition-colors px-2 py-1 rounded block",
                    isActive
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "hover:text-blue-600 dark:hover:text-blue-400"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}
