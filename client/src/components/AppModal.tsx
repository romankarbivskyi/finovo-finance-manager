import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModalStore, type ModalType } from "@/stores/modalStore";
import React from "react";

const MODAL_COMPONENTS: Record<Exclude<ModalType, null>, React.FC<any>> = {
  auth: React.lazy(() => import("./modals/AuthModal")),
  changePassword: React.lazy(() => import("./modals/ChangePasswordModal")),
  createTransaction: React.lazy(
    () => import("./modals/CreateTransactionModal"),
  ),
  deleteAccount: React.lazy(() => import("./modals/DeleteAccountModal")),
  deleteGoal: React.lazy(() => import("./modals/DeleteGoalModal")),
  editProfile: React.lazy(() => import("./modals/EditProfileModal")),
};

const AppModal = () => {
  const { isOpen, type, props, closeModal } = useModalStore();

  if (!isOpen || !type) {
    return null;
  }

  const SpecificModalContent = MODAL_COMPONENTS[type];

  if (!SpecificModalContent) {
    console.warn(`No modal component found for type: ${type}`);
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <SpecificModalContent {...props} key={type + JSON.stringify(props)} />
      </DialogContent>
    </Dialog>
  );
};

export default AppModal;
