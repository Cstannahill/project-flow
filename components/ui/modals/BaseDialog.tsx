// components/ui/BaseDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

type DialogSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "full";

interface Props {
  open: boolean;
  onCloseAction: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  size?: DialogSize;
  middle?: boolean;
}

export default function BaseDialog({
  open,
  onCloseAction,
  title,
  children,
  actions,
  size = "md",
  middle = false,
}: Props) {
  const widthMap: Record<DialogSize, string> = {
    xs: "max-w-xs w-xs ",
    sm: "max-w-sm w-sm ",
    md: "max-w-md w-md ",
    lg: "!max-w-lg w-lg ",
    xl: "!max-w-xl w-xl ",
    "2xl": "!max-w-2xl  w-2xl ",
    "3xl": "!max-w-3xl w-3xl ",
    "4xl": "!max-w-4xl w-4xl ",
    "5xl": "!max-w-5xl w-5xl ",
    full: "!max-w-full !w-100vw",
  };
  const isMiddle = "absolute top-50 left-50";
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onCloseAction()}>
      <DialogContent
        className={cn(
          // never exceed ~85% of viewport
          "bg-background dark:bg-surface-dark",
          "max-vh-85 right fixed top-0 h-auto bg-[#1b1916] shadow-lg",
          widthMap[size],
        )}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4">{children}</div>

        {actions && (
          <DialogFooter className="flex justify-end gap-2">
            {actions}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
