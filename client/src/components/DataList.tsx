import PaginationComponent from "./Pagination";
import { ITEMS_PER_PAGE } from "@/constants";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { JSX } from "react";

interface DataListProps<T> {
  data: T[];
  isLoading: boolean;
  page: number;
  total: number;
  onPageChange: (page: number) => void;
  renderItem: (item: T, key?: string | number) => JSX.Element;
  containerClassName?: string;
  itemsPerPage?: number;
}

export const DataList = function <T>(props: DataListProps<T>) {
  const {
    data,
    isLoading,
    page,
    total,
    onPageChange,
    renderItem,
    containerClassName,
    itemsPerPage = ITEMS_PER_PAGE,
  } = props;

  if (isLoading && data.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center">
        <p className="text-lg font-medium">No items found</p>
        <p className="text-muted-foreground text-sm">
          Try changing your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className={cn(containerClassName)}>
        {data.map((item, idx) => renderItem(item, idx))}
      </div>

      {total > itemsPerPage && (
        <div className="flex justify-center pt-4">
          <PaginationComponent
            currentPage={page}
            totalItems={total}
            pageSize={itemsPerPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default DataList;
