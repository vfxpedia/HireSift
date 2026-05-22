import { useTranslation } from "react-i18next";
import { LANGUAGES, type LanguageCode } from "../../i18n";
import { cn } from "../../lib/cn";

interface Props {
  variant?: "dark" | "light";
  className?: string;
}

export function LanguageToggle({ variant = "light", className }: Props) {
  const { i18n } = useTranslation();
  const current = (i18n.resolvedLanguage ?? i18n.language ?? "en") as LanguageCode;

  const change = (code: LanguageCode) => {
    if (current !== code) i18n.changeLanguage(code);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border p-0.5",
        variant === "dark"
          ? "border-white/20 bg-white/5"
          : "border-[#E5E7EB] bg-[#F7F8FA]",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      {LANGUAGES.map((l) => {
        const active = current.startsWith(l.code);
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => change(l.code)}
            className={cn(
              "px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors",
              active
                ? variant === "dark"
                  ? "bg-white text-[#172033]"
                  : "bg-white text-[#172033] shadow-sm"
                : variant === "dark"
                ? "text-white/60 hover:text-white"
                : "text-[#6B7280] hover:text-[#374151]",
            )}
            aria-pressed={active}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
