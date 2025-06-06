import {
  LayoutDashboard,
  ArrowLeftRight,
  User2,
  ChevronUp,
  LogOut,
  CircleUser,
  Goal,
} from "lucide-react";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Sidebar,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

const SidebarNav = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === "admin";

  const routes = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Goals",
      path: "/goals",
      icon: <Goal size={18} />,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <ArrowLeftRight size={18} />,
    },
    {
      name: "Users",
      path: "/users",
      icon: <User2 size={18} />,
      adminOnly: true,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link to="/" className="text-lg font-semibold">
          Finovo
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarMenu className="p-2">
          {routes.map((route) => {
            if (route.adminOnly && !isAdmin) return null;
            else
              return (
                <SidebarMenuItem key={route.name}>
                  <Link to={route.path}>
                    <SidebarMenuButton className="w-full justify-start">
                      {route.icon}
                      <span className="ml-2">{route.name}</span>
                      {route.adminOnly && (
                        <span className="ml-auto rounded border border-red-400 px-1 text-xs font-medium text-red-400">
                          Admin
                        </span>
                      )}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <div className="flex items-center">
                    <User2 size={20} className="mr-2" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {user?.username}
                      </span>
                    </div>
                  </div>
                  <ChevronUp size={18} className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="mb-2 w-[var(--radix-popper-anchor-width)]"
              >
                <DropdownMenuItem onClick={() => navigate("/account")}>
                  <CircleUser size={16} className="mr-2" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut size={16} className="mr-2" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarNav;
