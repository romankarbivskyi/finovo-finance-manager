import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="border-muted-foreground/20 bg-background hover:bg-muted fixed right-4 bottom-4 h-10 w-10 rounded-full shadow-md md:right-8 md:bottom-8"
            aria-label={
              isDark ? "Switch to light theme" : "Switch to dark theme"
            }
          >
            <Sun
              className={`h-[1.2rem] w-[1.2rem] transition-all ${isDark ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
            />
            <Moon
              className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDark ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{isDark ? "Switch to light mode" : "Switch to dark mode"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle;
