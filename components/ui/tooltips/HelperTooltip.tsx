"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export type HelperTooltipProps = {
  /** The text or JSX to show inside the tooltip */
  content: ReactNode;
  /** Where to position the tooltip relative to the trigger */
  placement?: "top" | "bottom" | "left" | "right";
  /** Optional custom trigger (e.g. a button); defaults to an ℹ️ icon */
  children?: ReactNode;
};

export function HelperTooltip({
  content,
  placement = "top",
  children,
}: HelperTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger className="cursor-pointer" asChild>
        {/* <Button variant="ghost" size="icon" className="p-0">
            <Trash2 />
          </Button> */}
      </TooltipTrigger>
      <TooltipContent className="bg-brand z-50  mt-2 px-2 text-black">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
