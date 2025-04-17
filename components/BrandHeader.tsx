// components/layout/BrandHeader.tsx
import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

interface BrandHeaderProps {
  icon: ReactNode;
  brandName: string;
  subtitle?: string;
  className?: string;
}

export default function BrandHeader({
  icon,
  brandName,
  subtitle,
  className,
}: BrandHeaderProps) {
  return (
    <div className="flex gap-4">
      <Link href="/" className={`flex items-center gap-2 mx-auto ${className}`}>
        <Image
          src="/icons/shadyt-logo.png"
          alt="Logo"
          width={60}
          height={60}
          className={`h-12 w-auto rounded-full border border-white/20`}
        />
        <span className="font-bold text-lg tracking-tight">shadyt-dev</span>
      </Link>
    </div>
  );
}
