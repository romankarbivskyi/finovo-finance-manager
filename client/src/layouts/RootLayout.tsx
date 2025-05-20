import { AppModal, ThemeToggle } from "@/components";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router";

const RootLayout = () => {
  return (
    <div>
      <Toaster position="bottom-right" richColors />
      <Outlet />
      <ThemeToggle />
      <AppModal />
    </div>
  );
};

export default RootLayout;
