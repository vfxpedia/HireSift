import { Toaster as Sonner, toast } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        className: "!bg-white !text-[#111827] !border !border-[#E5E7EB] !rounded-xl !shadow-lg !text-sm",
        duration: 3000,
      }}
    />
  );
}

export { toast };
