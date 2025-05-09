import { Outlet, redirect } from "react-router";
import SidebarNav from "@/components/SidebarNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

const DashboardLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return redirect("/");

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
