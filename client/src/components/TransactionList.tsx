import type { ITransaction } from "@/types/transaction.types";
import DataList from "./DataList";
import Transaction from "./Transaction";
import { ITEMS_PER_PAGE } from "@/constants";

interface TransactionListProps {
  transactions: ITransaction[];
  total: number;
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  onDelete?: () => void;
  itemsPerPage?: number;
}

const TransactionList = ({
  transactions,
  total,
  isLoading,
  page,
  setPage,
  onDelete,
  itemsPerPage = ITEMS_PER_PAGE,
}: TransactionListProps) => {
  return (
    <DataList
      data={transactions}
      isLoading={isLoading}
      page={page}
      total={total}
      onPageChange={setPage}
      renderItem={(transaction) => (
        <Transaction transaction={transaction} onDelete={onDelete} />
      )}
      containerClassName="space-y-2"
      itemsPerPage={itemsPerPage}
    />
  );
};

export default TransactionList;
