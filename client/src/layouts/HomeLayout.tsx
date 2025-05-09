import TopNav from "@/components/TopNav";
import { Outlet } from "react-router";

const HomeLayout = () => {
  return (
    <div>
      <TopNav />
      <Outlet />
    </div>
  );
};

export default HomeLayout;
