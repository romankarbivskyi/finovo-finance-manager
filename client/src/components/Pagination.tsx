import {
  Pagination as PaginationContainer,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "./ui/pagination";
import { useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  siblingCount?: number;
  onPageChange: (page: number) => void;
}

const PaginationComponent = ({
  currentPage,
  totalItems,
  pageSize,
  siblingCount = 1,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    pages.push(1);
    const leftSiblingIndex = Math.max(2, currentPage - siblingCount);
    const rightSiblingIndex = Math.min(
      totalPages - 1,
      currentPage + siblingCount,
    );
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (showLeftDots) {
      pages.push("ellipsis-left");
    } else if (leftSiblingIndex === 2) {
      pages.push(2);
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    if (showRightDots) {
      pages.push("ellipsis-right");
    } else if (rightSiblingIndex === totalPages - 1) {
      pages.push(totalPages - 1);
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, siblingCount]);

  if (totalPages <= 1) {
    return null;
  }

  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  return (
    <PaginationContainer>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-label="Go to previous page"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (safePage > 1) onPageChange(safePage - 1);
            }}
            className={safePage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => (
          <PaginationItem key={`page-${page}-${index}`}>
            {page === "ellipsis-left" || page === "ellipsis-right" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(Number(page));
                }}
                isActive={safePage === page}
                aria-label={`Page ${page}`}
                aria-current={safePage === page ? "page" : undefined}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            aria-label="Go to next page"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (safePage < totalPages) onPageChange(safePage + 1);
            }}
            className={
              safePage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationContainer>
  );
};

export default PaginationComponent;
