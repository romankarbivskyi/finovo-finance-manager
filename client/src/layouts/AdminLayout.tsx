import { useAuth } from "@/hooks/useAuth";
import { Outlet } from "react-router";

const AdminLayout = () => {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return <div>You do not have permission to access this page.</div>;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
