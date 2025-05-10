import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { sendRecoveryToken } from "@/services/user.service";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

interface ForgotPasswordFormInputs {
  email: string;
}

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    try {
      setIsSubmitting(true);
      const response = await sendRecoveryToken(data.email);

      if (response) {
        toast.success("Recovery link sent to your email!");
        onBackToLogin();
      } else {
        toast.error("Failed to send recovery link. Please try again.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-center text-xl font-semibold">Reset Password</h2>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit((data) => onSubmit(data))();
          }}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="somename@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Recovery Link"}
            </Button>

            <Button type="button" variant="outline" onClick={onBackToLogin}>
              Back to Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
