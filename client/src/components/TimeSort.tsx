import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TimeSortProps {
  onSortChange: (sortBy: string) => void;
}

const TimeSort = ({ onSortChange }: TimeSortProps) => {
  return (
    <div>
      <Select onValueChange={onSortChange} defaultValue="new">
        <SelectTrigger className="w-full max-w-[180px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">From new to old</SelectItem>
          <SelectItem value="old">From old to new</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSort;
