// import { TransactionList } from "@/components";
// import Header from "@/components/Header";
// import { ITEMS_PER_PAGE } from "@/constants";
// import { getAllTransactions } from "@/services/transaction.service";
// import { useQuery } from "@tanstack/react-query";
// import { useState } from "react";

const TransactionsPage = () => {
  // const [page, setPage] = useState<number>(1);
  // const offset = (page - 1) * ITEMS_PER_PAGE;

  // const { data: apiResponse, isLoading } = useQuery({
  //   queryKey: ["transactions", page],
  //   queryFn: async () => await getAllTransactions(ITEMS_PER_PAGE, offset),
  // });

  // const transactionsData = apiResponse?.data || [];
  // const {transactions, total} = transactionsData;

  // return (
  //   <div>
  //     <Header
  //       title="Transactions"
  //       subtitle="View and manage your transactions"
  //     />
  //     <div className="container mx-auto mt-4">
  //       <TransactionList
  //         transactions={transactions}
  //         total={total}
  //         currency={apiResponse?.currency || ""}
  //         isLoading={isLoading}
  //         page={page}
  //         setPage={setPage}
  //       />
  //     </div>
  //   </div>
  // );

  return <div>Transactions</div>;
};

export default TransactionsPage;
