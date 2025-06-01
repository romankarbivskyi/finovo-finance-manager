import { TransactionList } from "@/components";
import Header from "@/components/Header";
import { ITEMS_PER_PAGE } from "@/constants";
import { getAllTransactions } from "@/api/transaction.api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const TransactionsPage = () => {
  const [page, setPage] = useState<number>(1);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["transactions", page],
    queryFn: async () => await getAllTransactions(ITEMS_PER_PAGE, offset),
    refetchInterval: 10000,
  });

  const { transactions = [], total = 0 } = apiResponse?.data ?? {};

  return (
    <div>
      <Header
        title="Transactions"
        subtitle="View and manage your transactions"
      />
      <div className="container mx-auto mt-4">
        <TransactionList
          transactions={transactions}
          total={total}
          isLoading={isLoading}
          page={page}
          setPage={setPage}
          onDelete={refetch}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;
