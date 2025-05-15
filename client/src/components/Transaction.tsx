import { formatDistanceToNow } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from "lucide-react";
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

interface TransactionProps {
  transaction: ITransaction;
  onDelete?: () => void;
}

const Transaction = ({ transaction, onDelete }: TransactionProps) => {
  const { id, amount, transaction_type, description, created_at, currency } =
    transaction;

  const isIncome = transaction_type === "income";
  const formattedDate = formatDistanceToNow(new Date(created_at), {
    addSuffix: true,
  });
  const fullDate = format(new Date(created_at), "PPP 'at' p");

  const handleDelete = async () => {
    const response = await deleteTransaction(id);

    if (response.success) {
      const successMessage =
        response.message || "Transaction deleted successfully";
      toast.success(successMessage);
      onDelete?.();
    } else {
      const errorMessage = response.message || "Failed to delete transaction";
      toast.error(errorMessage);
    }
  };

  return (
    <Card className="min-w-[600px] overflow-hidden py-2">
      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                isIncome ? "bg-green-100" : "bg-red-100",
              )}
            >
              {isIncome ? (
                <ArrowUpCircle className="h-6 w-6 text-green-600" />
              ) : (
                <ArrowDownCircle className="h-6 w-6 text-red-600" />
              )}
            </div>

            <p className="text-muted-foreground line-clamp-1 text-sm">
              {description || "No description"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-muted-foreground text-sm">
                      {formattedDate}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{fullDate}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <p
                className={cn(
                  "text-lg font-semibold",
                  isIncome ? "text-green-600" : "text-red-600",
                )}
              >
                {isIncome ? "+" : "-"}
                {Math.abs(amount).toFixed(2)}
                <span className="text-sm">{currency}</span>
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Transaction;
