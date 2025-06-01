import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { deleteAccount } from "@/api/user.api";
import { useAuth } from "@/hooks/useAuth";

interface DeleteAccountModalProps {
  userId?: number;
  onDelete?: () => void;
}

const DeleteAccountModal = ({ userId, onDelete }: DeleteAccountModalProps) => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const handleDelete = async () => {
    const response = await deleteAccount(userId);

    if (response.success) {
      toast.success(response?.message || "Account deleted successfully");
      if (onDelete && userId) {
        onDelete();
      } else {
        setUser(null);
        navigate("/");
      }
    } else {
      toast.error(response?.error || "Failed to delete account");
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete account and
          remove all associated data.
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
    </>
  );
};

export default DeleteAccountModal;
