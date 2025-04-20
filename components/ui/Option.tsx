// components/ui/option.tsx
import { CheckIcon } from "@radix-ui/react-icons";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

export interface OptionProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  /**
   * Human‑readable text shown both
   * in the trigger when selected and inside the option row.
   */
  label: string;
  /**
   * Optional leading icon — e.g. country flag, status dot.
   * Pass any React node, it will be size‑constrained.
   */
  icon?: React.ReactNode;
}

export function Option({
  label,
  value,
  icon,
  className,
  ...props
}: OptionProps) {
  return (
    <SelectPrimitive.Item
      value={value}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-8 py-2 text-sm outline-none",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
        className
      )}
      {...props}
    >
      {/* Left icon slot */}
      {icon && (
        <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
          {icon}
        </span>
      )}

      {/* Visible text for the option */}
      <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>

      {/* Checkmark when selected */}
      <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex h-4 w-4 items-center justify-center">
        <CheckIcon className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
