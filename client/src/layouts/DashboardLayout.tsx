import { Outlet } from "react-router";
import SidebarNav from "@/components/SidebarNav";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <SidebarNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <SidebarTrigger />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
