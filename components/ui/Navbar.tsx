"use client";

import React, { ReactNode, useState } from "react";
import clsx from "clsx";
import NavItem from "./NavItem";
import { Divider } from "@/components/ui/Divider";
import BrandHeader from "@/components/BrandHeader";
import Image from "next/image";
import LogoutButton from "../LogoutButton";
import { store } from "@/lib/store/store";
import { ThemeChanger } from "../ThemeChanger";

type LayoutMode = "top" | "side" | "both";

interface NavbarProps {
  brand?: ReactNode;
  menuItems: { label: string; href: string }[];
  layout?: LayoutMode;
  cta?: ReactNode;
  className?: string;
}

/**
 * Navbar
 * ---------------------
 * A responsive navigation bar with top, side, or hybrid layout modes.
 *
 * ✅ Use for:
 * - Application shell or site-wide navigation
 * - Header + side menu combo layouts
 * - Full-brand nav with optional CTA
 *
 * 🧠 Design Notes:
 * - Supports layout mode: 'top', 'side', or 'both'
 * - Mobile menu toggle built-in
 * - Fully composable with `NavItem`, `CTAButton`, logo slot, etc.
 *
 * 🛠️ Props:
 * - brand?: ReactNode — left logo or brand slot
 * - menuItems: { label: string; href: string }[] — nav links
 * - layout?: 'top' | 'side' | 'both' (default: 'top')
 * - cta?: ReactNode — optional call-to-action button
 * - className?: string — wrapper styling
 *
 * 🚀 Example Usage:
 * <Navbar
 *   brand={<Logo />}
 *   menuItems={[{ label: 'Docs', href: '/docs' }]}
 *   layout="top"
 *   cta={<CTAButton>Get Started</CTAButton>}
 * />
 */
const getIcon = () => {
  return (
    <>
      <Image
        src="/icons/shadyt-logo.png"
        alt="Logo"
        width={170}
        height={170}
        className="rounded-2xl border border-slate-300/50 shadow-sm shadow-slate-300/80 p-1"
      />
    </>
  );
};
const brandIcon = getIcon();
export default function Navbar({
  brand,
  menuItems,
  layout = "top",
  cta,
  className,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const isTop = layout === "top" || layout === "both";
  const isSide = layout === "side" || layout === "both";

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const linkCount = menuItems.length;
  const mapNavItems = (
    menuItem: { label: string; href: string },
    index: number
  ) => {
    return (
      <NavItem
        key={menuItem.href + layout + index + menuItem.label}
        exact={true}
        href={menuItem.href}
        layout={layout}
        index={index}
        label={menuItem.label}
      />
    );
  };

  const mapSideNavItems = (
    menuItem: { label: string; href: string },
    index: number
  ) => {
    if (index === 0) {
      return (
        <React.Fragment key={menuItem.href + menuItem.label + index}>
          <Divider
            spacing={1}
            key={menuItem.href + menuItem.label + index}
            className="my-0"
          />
          <NavItem
            key={menuItem.href + layout + index + menuItem.label}
            href={menuItem.href}
            exact={true}
            layout={layout}
            index={index}
            label={menuItem.label}
          />
          <Divider
            spacing={1}
            key={menuItem.href + "divivder" + menuItem.label + index}
            className="my-0"
          />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment key={menuItem.href + menuItem.label + index}>
          <NavItem
            href={menuItem.href}
            exact={true}
            layout={layout}
            index={index}
            label={menuItem.label}
          />
          <Divider
            spacing={1}
            key={menuItem.href + "divivder" + menuItem.label + index}
            className="my-0"
          />
        </React.Fragment>
      );
    }
  };
  return (
    <>
      {/* Top Navigation */}
      {isTop && (
        <header
          className={clsx(
            "w-full flex  items-center justify-between px-4 py-3 bg-brand-dark text-white shadow-md",
            className
          )}
        >
          <div className="flex items-center gap-4">
            {brand && <div className="text-lg font-bold">{brand}</div>}
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map(mapNavItems)}
          </nav>

          <div className="hidden md:flex items-center gap-2">{cta}</div>

          {/* Mobile Toggle */}
          <button
            onClick={toggleMobile}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileOpen ? "✖" : "☰"}
          </button>
        </header>
      )}

      {/* Side Drawer */}
      {isSide && (
        <aside
          className="bg-gradient-to-b from-[#0f172a] to-[#1e293b]
 text-white w-full  rounded-xl"
        >
          <BrandHeader
            icon={brandIcon}
            brandName="shadyt-ui"
            subtitle="ai, ui, db, api"
            className="mb-6 w-full"
          />
          <nav className="flex flex-col gap-4 ">
            {menuItems.map(mapSideNavItems)}
            <div className="flex flex-col gap-4 mt-4">
              <LogoutButton />
              <Divider spacing={1} className="my-0" />
              <button
                className="text-center ct-btn btn btn-md bg-linear-to-r from-cyan-100 via-blue-300 to-indigo-400 text-sm text-gray-800 hover:text-gray-500"
                onClick={() => console.log(store.getState())}
              >
                State
              </button>
              <ThemeChanger />
            </div>
          </nav>
        </aside>
      )}
    </>
  );
}
