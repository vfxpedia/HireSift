import React from "react";
import { cn } from "../../lib/cn";

type BtnProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export function PrimaryBtn({ children, onClick, className = "", icon, type = "button", disabled }: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 bg-[#172033] text-white text-sm font-medium rounded-xl hover:bg-[#1e2d47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function SecondaryBtn({ children, onClick, className = "", icon, type = "button", disabled }: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#172033] text-sm font-medium rounded-xl border border-[#E5E7EB] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function AttentionBtn({ children, onClick, className = "", icon, type = "button", disabled }: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#8A6422] text-sm font-medium rounded-xl border border-[#C6923A]/40 hover:bg-[#C6923A]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}
