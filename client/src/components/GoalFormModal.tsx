import { Pencil, Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createOrUpdateGoal } from "@/services/goal.service";
import { toast } from "sonner";
import type { Goal } from "@/types/goal.types";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

const currencyEnum = z.enum(["USD", "EUR", "UAH"]);

const goalSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    currentAmount: z
      .number()
      .min(0, "Current amount must be greater than or equal to 0"),
    targetAmount: z.number().min(0, "Target amount must be greater than 0"),
    targetDate: z.date(),
    currency: currencyEnum,
    image: z.instanceof(File).optional(),
  })
  .refine(
    (data) =>
      data.currentAmount === undefined ||
      data.targetAmount === undefined ||
      data.currentAmount < data.targetAmount,
    {
      message: "Current amount must be less than target amount",
      path: ["currentAmount"],
    },
  );

type GoalFormValues = z.infer<typeof goalSchema>;

interface GoalFormModalProps {
  type?: "create" | "edit";
  goal?: Goal;
}

const GoalFormModal = ({ type, goal }: GoalFormModalProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    goal?.preview_image ?? null,
  );
  const [open, setOpen] = useState(false);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: goal?.name || "",
      description: goal?.description || "",
      currentAmount: goal?.current_amount || 0,
      targetAmount: goal?.target_amount || 0,
      targetDate: goal?.target_date ? new Date(goal.target_date) : new Date(),
      currency: goal?.currency || "USD",
    },
  });

  const onSubmit = async (data: GoalFormValues) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("current_amount", data.currentAmount.toString());
      formData.append("target_amount", data.targetAmount.toString());
      formData.append("target_date", format(data.targetDate, "yyyy-MM-dd"));
      formData.append("currency", data.currency);

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      if (type === "edit" && goal?.id) {
        const response = await createOrUpdateGoal(formData, goal.id);

        if (response.success) {
          toast.success("Goal updated successfully");
        } else {
          toast.error(response.message || "Failed to update goal");
          return;
        }
      } else if (type === "create") {
        const response = await createOrUpdateGoal(formData);

        if (response.success) {
          toast.success("Goal created successfully");
        } else {
          toast.error(response.message || "Failed to create goal");
          return;
        }
      }

      setOpen(false);
      form.reset();
      setImagePreview(null);

      navigate("/goals");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "create" ? (
          <Button
            className="flex items-center gap-2"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create
          </Button>
        ) : (
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] max-w-[500px] p-4 sm:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle>
            {type === "create" ? "Create" : "Edit"} Goal
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Iphone 16" {...field} />
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
                    <Textarea
                      placeholder="Describe your goal"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="currentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="0"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d.]/g, "");
                          field.onChange(value === "" ? 0 : parseFloat(value));
                        }}
                        value={field.value === 0 ? "" : field.value}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="1000"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d.]/g, "");
                          field.onChange(value === "" ? 0 : parseFloat(value));
                        }}
                        value={field.value === 0 ? "" : field.value}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                        <SelectTrigger>
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

              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);

                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImagePreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        {...fieldProps}
                        className="w-full"
                      />

                      {imagePreview && (
                        <div className="mt-2 aspect-video max-h-[160px] overflow-hidden rounded border">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                    Upload an image to represent your goal
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6 sm:mt-8">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? type === "edit"
                    ? "Saving..."
                    : "Creating..."
                  : type === "edit"
                    ? "Save Changes"
                    : "Create Goal"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalFormModal;
