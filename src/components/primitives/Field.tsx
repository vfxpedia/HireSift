import React from "react";
import { cn } from "../../lib/cn";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
};

export function Field({ label, hint, error, optional, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#374151] mb-1.5">
        {label}
        {optional && <span className="text-[#9CA3AF] font-normal"> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-[#8A6422]">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-[#9CA3AF]">{hint}</p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "w-full px-3 py-2.5 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2F7D7E]/30 focus:border-[#2F7D7E]";

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean },
) {
  const { className, error, ...rest } = props;
  return (
    <input
      {...rest}
      className={cn(inputClass, error && "border-[#C6923A] focus:ring-[#C6923A]/30", className)}
    />
  );
}
