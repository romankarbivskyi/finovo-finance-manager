import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface BackLinkProps {
  title?: string;
  to?: string;
  className?: string;
}

const BackLink = ({ title, to, className }: BackLinkProps) => {
  return (
    <div className={cn("mb-6 flex items-center gap-2", className)}>
      <Button variant="outline" size="icon" asChild>
        <Link to={to || "/dashboard"}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <h1 className="text-2xl font-bold">{title || "Go Back"}</h1>
    </div>
  );
};

export default BackLink;
