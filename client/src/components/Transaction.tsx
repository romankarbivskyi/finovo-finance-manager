import { formatDistanceToNow } from "date-fns";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CalendarIcon,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ITransaction } from "@/types/transaction.types";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { format } from "date-fns";
import { deleteTransaction } from "@/services/transaction.service";
import { toast } from "sonner";
import { Badge } from "./ui/badge";

interface TransactionProps {
  transaction: ITransaction;
  onDelete?: () => void;
}

const Transaction = ({ transaction, onDelete }: TransactionProps) => {
  const {
    id,
    amount,
    transaction_type,
    description,
    created_at,
    currency,
    goal_name,
  } = transaction;

  const isContribution = transaction_type === "contribution";
  const formattedDate = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
  });
  const fullDate = format(new Date(created_at), "PPP 'at' p");

  const getTransactionLabel = () => {
    if (goal_name) {
      return (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium">{goal_name}</span>
          <Badge
            className={cn(
              "h-5 px-1.5 text-[10px] leading-none font-bold uppercase",
              isContribution
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700",
            )}
          >
            {isContribution ? "Contribution" : "Withdrawal"}
          </Badge>
        </div>
      );
    } else {
      return (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-medium">
            {isContribution ? "Account Deposit" : "Account Withdrawal"}
          </span>
        </div>
      );
    }
  };

  const handleDelete = async () => {
    const response = await deleteTransaction(id);
    if (response.success) {
      toast.success(response.message || "Transaction deleted successfully");
      onDelete?.();
    } else {
      toast.error(response.message || "Failed to delete transaction");
    }
  };

  return (
    <Card
      className="group dark:hover:shadow-primary/5 overflow-hidden border-l-4 py-0 transition-all hover:shadow-md"
      style={{
        borderLeftColor: isContribution
          ? "rgb(16, 185, 129)"
          : "rgb(225, 29, 72)",
      }}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full transition-colors",
                isContribution
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-rose-100 text-rose-600",
              )}
            >
              {isContribution ? (
                <ArrowUpCircle className="h-6 w-6" />
              ) : (
                <ArrowDownCircle className="h-6 w-6" />
              )}
            </div>

            <div className="flex flex-col">
              {getTransactionLabel()}
              <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                {description || "No description provided"}
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <CalendarIcon className="text-muted-foreground h-3 w-3" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-muted-foreground text-xs">
                        {formattedDate}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{fullDate}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <p
              className={cn(
                "text-right font-medium tracking-tight",
                isContribution ? "text-emerald-600" : "text-rose-600",
              )}
            >
              <span className="mr-0.5">{isContribution ? "+" : "−"}</span>
              <span className="text-base font-semibold">
                {Math.abs(amount).toFixed(2)}
              </span>
              <span className="ml-1 text-xs">{currency}</span>
            </p>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-rose-100 hover:text-rose-700"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete transaction</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Transaction;
