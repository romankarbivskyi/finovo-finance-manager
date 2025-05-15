import type { ITransaction } from "@/types/transaction.types";
import DataList from "./DataList";
import Transaction from "./Transaction";

interface TransactionListProps {
  transactions: ITransaction[];
  total: number;
  currency: string;
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  onDelete?: () => void;
}

const TransactionList = ({
  transactions,
  total,
  currency,
  isLoading,
  page,
  setPage,
  onDelete,
}: TransactionListProps) => {
  return (
    <DataList
      data={transactions}
      isLoading={isLoading}
      page={page}
      total={total}
      onPageChange={setPage}
      renderItem={(transaction) => (
        <Transaction
          transaction={transaction}
          currency={currency}
          onDelete={onDelete}
        />
      )}
      containerClassName="space-y-2"
    />
  );
};

export default TransactionList;
