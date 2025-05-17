import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { createTransaction } from "@/services/transaction.service";
import { toast } from "sonner";
import { useState } from "react";

const transactionSchema = z.object({
  goal_id: z
    .number()
    .positive({ message: "Goal ID must be a positive number" }),
  amount: z.number().positive({ message: "Amount must be a positive number" }),
  description: z.string().optional(),
  transaction_type: z.enum(["income", "expense"], {
    required_error: "Transaction type is required",
    invalid_type_error: "Transaction type must be 'income' or 'expense'",
  }),
});

type CreateTransactionValues = z.infer<typeof transactionSchema>;

interface CreateTransactionModalProps {
  goalId: number;
  onCreate?: () => void;
}

const CreateTransactionModal = ({
  goalId,
  onCreate,
}: CreateTransactionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<CreateTransactionValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      goal_id: goalId,
      amount: 0,
      description: "",
      transaction_type: "income",
    },
  });

  const onSubmit = async (data: CreateTransactionValues) => {
    setIsSubmitting(true);
    const { goal_id, amount, description, transaction_type } = data;

    const response = await createTransaction(
      goal_id,
      amount,
      description!,
      transaction_type,
    );

    if (response.success) {
      toast.success(response?.message || "Transaction created successfully");
      form.reset();
      setOpen(false);
      onCreate?.();
    } else {
      toast.error(response?.error || "Failed to create transaction");
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? 0 : Number(value));
                      }}
                      value={field.value === 0 ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transaction_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transaction type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Create Transaction"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionModal;
