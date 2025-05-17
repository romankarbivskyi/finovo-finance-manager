import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { resetPassword } from "@/services/user.service";

const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsSubmitting(true);

    const response = await resetPassword(data.token, data.password);

    if (response.success) {
      toast.success(response.message || "Password reset successfully");
      navigate("/");
    } else {
      toast.error(response.message || "Failed to reset password");
    }

    setIsSubmitting(false);
  };

  return (
    <Card className="mx-auto mt-2 max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
