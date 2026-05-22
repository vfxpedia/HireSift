import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZE: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

export function Modal({ open, onClose, title, description, children, footer, size = "md" }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto",
            SIZE[size],
          )}
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {(title || description) && (
            <div className="mb-4">
              {title && (
                <Dialog.Title className="font-bold text-[#111827] text-base">{title}</Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="text-xs text-[#6B7280] mt-1">
                  {description}
                </Dialog.Description>
              )}
            </div>
          )}
          <Dialog.Close
            asChild
            className="absolute top-4 right-4"
          >
            <button
              type="button"
              aria-label="Close"
              className="p-1.5 text-[#6B7280] hover:text-[#374151] rounded-lg hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
            </button>
          </Dialog.Close>
          <div>{children}</div>
          {footer && <div className="mt-5 flex gap-3 justify-end">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
