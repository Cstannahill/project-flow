"use client";

import { ReactNode, ElementType, Component } from "react";
import clsx from "clsx";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  asType?: ElementType<any>;
  href?: string;
  shadow?: "soft" | "elevated" | "none";
  hoverEffect?: boolean;
  onClick?: () => void;
}

/**
 * FloatingCard
 * ---------------------
 * A raised container with a soft shadow and hover lift effect.
 * Used to make individual blocks feel tactile and modern.
 *
 * ✅ Use for:
 * - Dashboard cards
 * - Feature previews
 * - Interactive tiles
 * - Docs / nav category previews
 *
 * 🧠 Design Notes:
 * - Includes optional hover transform and subtle scale
 * - Can act as a link if `href` is provided
 * - ClassName is forwarded so you can style freely
 *
 * 🛠️ Props:
 * - as: element type ('div', 'article', etc.)
 * - href: optional link wrapper
 * - hoverEffect: boolean (default: true)
 * - shadow: 'elevated' | 'soft' | 'none'
 * - className: string
 *
 * 🚀 Example Usage:
 * <FloatingCard className="bg-[#001f2e] p-6 text-white">
 *   <h3 className="text-lg font-semibold mb-1">AI for Mongo</h3>
 *   <P className="text-sm opacity-80">LLMs in embedded search & doc AI.</P>
 * </FloatingCard>
 */

export default function FloatingCard({
  children,
  className,
  asType = "div",
  href,
  shadow = "elevated",
  hoverEffect = true,
  onClick,
}: FloatingCardProps) {
  const Component = asType as any;
  const base = clsx(
    "rounded-2xl transition-all duration-300 ease-in-out overflow-hidden bg-gray-800",
    shadow === "elevated" && "shadow-[0_12px_40px_rgba(0,0,0,0.2)]",
    shadow === "soft" && "shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
    shadow === "none" && "shadow-none",
    hoverEffect &&
      "hover:-translate-y-[4px] hover:shadow-[0_16px_44px_rgba(0,0,0,0.25)]",
    className
  );

  const inner = (
    <Component onClick={onClick && onClick} className={`${base}`}>
      {children}
    </Component>
  );

  return href ? (
    <a href={href} className="block no-underline">
      {inner}
    </a>
  ) : (
    inner
  );
}
