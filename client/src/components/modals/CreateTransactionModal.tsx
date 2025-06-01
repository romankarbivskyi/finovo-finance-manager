import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createTransaction } from "@/api/transaction.api";
import { toast } from "sonner";
import { useState } from "react";
import { currencyEnum } from "@/constants";
import { useModalStore } from "@/stores/modalStore";
import type { GoalCurrency } from "@/types/goal.types";

const transactionSchema = z.object({
  goal_id: z
    .number()
    .positive({ message: "Goal ID must be a positive number" }),
  amount: z.number().positive({ message: "Amount must be a positive number" }),
  currency: currencyEnum,
  description: z.string().optional(),
  transaction_type: z.enum(["contribution", "withdrawal"], {
    required_error: "Transaction type is required",
    invalid_type_error:
      "Transaction type must be 'contribution' or 'withdrawal'",
  }),
});

type CreateTransactionValues = z.infer<typeof transactionSchema>;

interface CreateTransactionModalProps {
  goalId: number;
  onCreate?: () => void;
  defaultCurrency?: GoalCurrency;
}

const CreateTransactionModal = ({
  goalId,
  onCreate,
  defaultCurrency,
}: CreateTransactionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeModal } = useModalStore();

  const form = useForm<CreateTransactionValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      goal_id: goalId,
      amount: 0,
      currency: defaultCurrency || "USD",
      description: "",
      transaction_type: "contribution",
    },
  });

  const onSubmit = async (data: CreateTransactionValues) => {
    setIsSubmitting(true);
    const { goal_id, amount, currency, description, transaction_type } = data;

    const response = await createTransaction(
      goal_id,
      amount,
      currency,
      description!,
      transaction_type,
    );

    if (response.success) {
      toast.success(response?.message || "Transaction created successfully");
      form.reset();
      closeModal();
      onCreate?.();
    } else if (response.errors) {
      if (Object.keys(response.errors).length > 0) {
        Object.entries(response.errors).forEach(([input, error]) => {
          form.setError(input as keyof CreateTransactionValues, {
            type: "manual",
            message: error,
          });
        });
      }
    } else {
      toast.error(response?.error || "Failed to create transaction");
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create Transaction</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      className="w-full"
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
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="UAH">UAH</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="contribution">
                        <BanknoteArrowUp />
                        Contribution
                      </SelectItem>
                      <SelectItem value="withdrawal">
                        <BanknoteArrowDown />
                        Withdrawal
                      </SelectItem>
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
    </>
  );
};

export default CreateTransactionModal;
