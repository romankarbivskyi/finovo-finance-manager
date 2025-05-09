import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import AuthModal from "./AuthModal";

const TopNav = () => {
  return (
    <div className="relative flex items-center justify-between border-b p-4">
      <h1 className="text-2xl font-semibold">Finovo</h1>
      <nav className="absolute left-1/2 hidden -translate-x-1/2 transform items-center gap-10 md:flex">
        <a href="/" className="text-sm">
          Home
        </a>
        <a href="/about" className="text-sm">
          About
        </a>
        <a href="/contact" className="text-sm">
          Contact
        </a>
      </nav>
      <div className="hidden md:block">
        <AuthModal />
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
              <a href="/" className="text-sm">
                Home
              </a>
              <a href="/about" className="text-sm">
                About
              </a>
              <a href="/contact" className="text-sm">
                Contact
              </a>
            </nav>
            <AuthModal />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TopNav;
