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
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { toast } from "sonner";
import { login } from "@/services/user.service";
import { useState } from "react";
import { useModalStore } from "@/stores/modalStore";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = ({ onForgotPassword }: { onForgotPassword: () => void }) => {
  const { setUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { closeModal } = useModalStore();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    const response = await login(data.email, data.password);

    if (response.success && response.data) {
      setUser(response.data);
      closeModal();
      toast.success("Login successful!");
    } else {
      toast.error(response?.error || "Login failed");
    }
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-right">
          <Button
            type="button"
            variant="link"
            className="h-auto p-0"
            onClick={onForgotPassword}
          >
            Forgot password?
          </Button>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
