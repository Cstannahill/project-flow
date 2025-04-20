import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({
  className,
  rows = 4, // default 4 rows
  ...props
}: React.ComponentProps<"textarea"> & { rows?: number }) {
  return (
    <textarea
      rows={rows}
      className={cn(
        "w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none " +
          "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 " +
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive " +
          "dark:bg-input/30 transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm " +
          "resize-y", // allow vertical resize
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
