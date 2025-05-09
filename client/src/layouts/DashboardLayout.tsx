import { Outlet, useNavigate } from "react-router";
import SidebarNav from "@/components/SidebarNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

import { useEffect } from "react";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  console.log("isAuthenticated", isAuthenticated);
  console.log("user", user);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <SidebarNav />
        <SidebarTrigger />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
