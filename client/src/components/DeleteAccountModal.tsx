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
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { deleteAccount } from "@/services/user.service";
import { useAuth } from "@/hooks/useAuth";

const DeleteAccountModal = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const handleDelete = async () => {
    const response = await deleteAccount();

    if (response.success) {
      toast.success(response?.message || "Account deleted successfully");
      setUser(null);
      navigate("/");
    } else {
      toast.error(response?.error || "Failed to delete account");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove all associated data.
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

export default DeleteAccountModal;
