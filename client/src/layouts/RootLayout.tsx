import { ThemeToggle } from "@/components";
import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Toaster position="bottom-right" richColors />
      {children}
      <ThemeToggle />
    </div>
  );
};

export default RootLayout;
