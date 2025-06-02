import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

const Search = ({ onSearchChange, placeholder = "Search" }: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    onSearchChange(debouncedQuery);
  }, [debouncedQuery, onSearchChange]);

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <SearchIcon
        className="stroke-muted-foreground absolute top-1/2 right-1 -translate-1/2"
        size={20}
      />
    </div>
  );
};

export default Search;
