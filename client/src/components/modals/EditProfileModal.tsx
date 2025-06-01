import { useState } from "react";
import { Button } from "../ui/button";
import { DialogTitle, DialogHeader } from "../ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateProfile } from "@/api/user.api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useModalStore } from "@/stores/modalStore";

const editProfileSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be at most 20 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

const EditProfileModal = () => {
  const { user, getProfile, setUser } = useAuth();
  const { closeModal } = useModalStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: EditProfileFormValues) => {
    setIsSubmitting(true);

    const response = await updateProfile(data.username, data.email);

    if (response.success) {
      toast.success(response?.message || "Profile updated successfully");
      setUser(await getProfile());
      closeModal();
    } else if (response.errors) {
      if (Object.keys(response.errors).length > 0) {
        Object.entries(response.errors).forEach(([input, error]) => {
          form.setError(input as keyof EditProfileFormValues, {
            type: "manual",
            message: error,
          });
        });
      }
    } else {
      toast.error(response?.message || "Failed to update profile");
    }

    setIsSubmitting(false);
    form.reset();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EditProfileModal;
