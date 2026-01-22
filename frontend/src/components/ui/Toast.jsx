import { Toaster } from "sonner";

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className:
          "rounded-2xl bg-surface-inverse text-ink shadow-float border border-surface-3 px-4 py-3",
        duration: 3600,
      }}
      richColors
    />
  );
}
