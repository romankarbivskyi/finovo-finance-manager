import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router";
import { useModalStore } from "@/stores/modalStore";

const TopNav = () => {
  const { isAuthenticated } = useAuth();
  const { openModal } = useModalStore();

  return (
    <div className="relative flex items-center justify-between border-b p-4">
      <Link to="/" className="text-2xl font-semibold">
        Finovo
      </Link>
      <nav className="absolute left-1/2 hidden -translate-x-1/2 transform items-center gap-10 md:flex">
        <Link to="/" className="text-sm">
          Home
        </Link>
        <a href="/#about" className="text-sm">
          About
        </a>
        <a href="/#contact" className="text-sm">
          Contact
        </a>
      </nav>
      <div className="hidden md:block">
        {isAuthenticated ? (
          <Button>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        ) : (
          <Button onClick={() => openModal("auth")}>Sign In</Button>
        )}
      </div>
      <div className="md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Menu />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="mr-4 flex max-w-min flex-col items-start gap-4 p-4">
            <nav className="flex flex-col items-start gap-4">
              <Link to="/" className="text-sm">
                Home
              </Link>
              <a href="/#about" className="text-sm">
                About
              </a>
              <a href="/#contact" className="text-sm">
                Contact
              </a>
            </nav>
            {isAuthenticated ? (
              <Button>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button onClick={() => openModal("auth")}>Sign In</Button>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TopNav;
