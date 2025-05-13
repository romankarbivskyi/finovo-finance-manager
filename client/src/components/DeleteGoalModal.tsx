import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Trash2 } from "lucide-react";
import { deleteGoal } from "@/services/goal.service";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface DeleteGoalModalProps {
  goalId: number;
}

const DeleteGoalModal = ({ goalId }: DeleteGoalModalProps) => {
  const navigate = useNavigate();
  const handleDelete = async () => {
    const response = await deleteGoal(goalId);

    if (response.success) {
      toast.success("Goal deleted successfully");
      navigate("/goals");
    } else {
      toast.error("Failed to delete goal");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your goal
            and remove all associated data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteGoalModal;
