import { Paper } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import FloatingCard from "./FloatingCard";

type Props = {
  item: {
    key: string;
    label: string;
    tool: string;
    language: string;
    docs: string;
    icon: string;
  };
};

export default function ProjectTechStackCard({ item }: Props) {
  return (
    <FloatingCard
      className="flex flex-row gap-4 p-4 items-start dark:bg-stone-800 dark:text-white bg-white text-gray-900 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 ease-in-out"
      shadow="elevated"
    >
      <div className="w-12 h-12 shrink-0 flex flex-col items-center justify-center">
        <Image
          src={item.icon}
          alt={item.tool}
          width={48}
          height={48}
          className="rounded mx-auto my-auto"
        />
      </div>

      <div className="flex-1">
        <div className="text-sm text-gray-500 uppercase">{item.label}</div>
        <div className="text-lg font-semibold">{item.tool}</div>
        {item.language && (
          <div className="text-sm text-gray-600">{item.language}</div>
        )}
        {item.docs && (
          <Link
            href={item.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 text-sm hover:underline mt-1"
          >
            Docs
            <ExternalLink className="w-4 h-4" />
          </Link>
        )}
      </div>
    </FloatingCard>
  );
}
