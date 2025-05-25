import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="my-10 text-center">
      <h1 className="text-xl font-medium">Oops! Page not found.</h1>
      <p className="text-sm text-zinc-400">
        We counldn't find the page you're looking for. It might have been moved
        or doesn't exist anymore.
      </p>
      <Button asChild className="mt-4" variant="outline">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go back to Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
