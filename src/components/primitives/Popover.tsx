import React from "react";
import * as RadixPopover from "@radix-ui/react-popover";
import { cn } from "../../lib/cn";

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
  sideOffset?: number;
}

export function Popover({ trigger, children, align = "end", className, sideOffset = 6 }: PopoverProps) {
  return (
    <RadixPopover.Root>
      <RadixPopover.Trigger asChild>{trigger}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-50 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-3 min-w-56",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className,
          )}
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {children}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}
