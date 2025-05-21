import TopNav from "@/components/TopNav";
import { Outlet } from "react-router";
import { Footer } from "@/components";

const HomeLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
