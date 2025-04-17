"use client";
import NavItem from "@/components/ui/NavItem";
import BrandHeader from "@/components/BrandHeader";
import { Divider } from "@/components/ui/Divider";
import Image from "next/image";
import ImageGallery from "../ImageGallery";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCurrentProject } from "@/lib/store/selectors";

interface SideNavProps {
  items: { label: string; href: string }[];
}
const imgGalleryPhotos = [
  {
    src: "/icons/shadytlogo/st16.png",
    width: 500,
    height: 500,
    alt: "Settings",
    title: "16px",
    description: "Slide description",
  },
  {
    src: "/icons/shadytlogo/st32.png",
    width: 500,
    height: 500,
    alt: "Settings",
    title: "32px",
    description: "Slide description",
  },
  {
    src: "/icons/shadytlogo/st64.png",
    width: 500,
    height: 500,
    alt: "Settings",
    title: "64px",
    description: "Slide description",
  },
  {
    src: "/icons/shadytlogo/st128.png",
    width: 500,
    height: 500,
    alt: "Settings",
    title: "128px",
    description: "Slide description",
  },
  {
    src: "/icons/shadytlogo/st180.png",
    width: 500,
    height: 500,
    alt: "Settings",
    title: "180px",
    description: "Slide description",
  },
  {
    src: "/icons/shadytlogo/st512.png",
    width: 500,
    height: 500,
    alt: "Settings",
    title: "512px",
    description: "Slide description",
  },
  {
    src: "/icons/shadytlogo/st1024-main.png",
    width: 500,
    height: 500,
    alt: "Settings",
    title: "1024px",
    description: "Slide description",
  },
  {
    src: "/icons/shadytlogo/st1024-trans.png",
    width: 500,
    height: 500,
    alt: "Settings",
    title: "1024tpx",
    description: "Slide description",
  },
  // {
  //   src: "/icons/shadytlogo/stmw.png",
  //   width: 500,
  //   height: 500,
  //   alt: "Settings",
  //   title: "1024px mw",
  //   description: "Slide description",
  // },
  // {
  //   src: "/icons/shadytlogo/stmb.png",
  //   width: 500,
  //   height: 500,
  //   alt: "Settings",
  //   title: "1024px mw",
  //   description: "Slide description",
  // },
];

const brandIcon = (
  <Image
    src="/icons/shadyt-logo.png"
    alt="Logo"
    width={48}
    height={48}
    className="rounded-lg border border-slate-300/500 shadow-sm p-0"
  />
);

export default function SideNav({ items }: SideNavProps) {
  const project = useAppSelector(selectCurrentProject);
  return (
    <aside className="w-[220px] rounded-2xl h-screen sticky top-0 hidden md:flex flex-col gap-1 p-3 bg-gradient-brand text-brand-text shadow-lg bg-radial-prime border-r border-white/10 z-40">
      <BrandHeader
        icon={brandIcon}
        brandName="shadyt-ui"
        subtitle="ai, ui, db, api"
        className="rounded-lg p-3 shadow border-brand-border text-brand border-white/10"
      />

      <nav className="flex flex-col gap-1 text-sm font-medium tracking-tight">
        <span className="text-zinc-400 text-2xs mt-0 mx-auto uppercase pl-2">
          {project?.name || "Project Nav"}
        </span>
        <div className="space-y-1">
          {items.map((item, index) => (
            <NavItem
              key={item.href}
              {...item}
              layout="side"
              exact={true}
              index={index}
              className="block px-3 py-2 rounded-md  transition-all duration-150 ease-in-out text-center"
              activeClassName="text-white font-semibold active-nav-item"
            />
          ))}
        </div>
      </nav>
      <div>
        <div className="flex items-center gap-2 text-sm font-medium tracking-tight bg-gradient-ui text-zinc-400 mt-4 mb-2">
          {/* <ImageGallery photos={imgGalleryPhotos} /> */}
        </div>
      </div>
    </aside>
  );
}
