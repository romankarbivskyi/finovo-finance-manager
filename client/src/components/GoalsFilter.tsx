import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface GoalsFilterProps {
  onStatusChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
}

const GoalsFilter = ({
  onStatusChange,
  onCurrencyChange,
}: GoalsFilterProps) => {
  return (
    <div className="mb-4 flex gap-4">
      <Label>Status</Label>
      <Select onValueChange={onStatusChange} defaultValue="all">
        <SelectTrigger className="w-full max-w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Label>Currency</Label>
      <Select onValueChange={onCurrencyChange} defaultValue="all">
        <SelectTrigger className="w-full max-w-[180px]">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="USD">USD</SelectItem>
          <SelectItem value="EUR">EUR</SelectItem>
          <SelectItem value="UAH">UAH</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default GoalsFilter;
