import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import AuthModal from "./AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router";

const TopNav = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative flex items-center justify-between border-b p-4">
      <h1 className="text-2xl font-semibold">Finovo</h1>
      <nav className="absolute left-1/2 hidden -translate-x-1/2 transform items-center gap-10 md:flex">
        <Link to="/" className="text-sm">
          Home
        </Link>
        <Link to="/about" className="text-sm">
          About
        </Link>
        <Link to="/contact" className="text-sm">
          Contact
        </Link>
      </nav>
      <div className="hidden md:block">
        {isAuthenticated ? (
          <Button>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        ) : (
          <AuthModal />
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
              <Link to="/about" className="text-sm">
                About
              </Link>
              <Link to="/contact" className="text-sm">
                Contact
              </Link>
            </nav>
            {isAuthenticated ? (
              <Button>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <AuthModal />
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TopNav;
