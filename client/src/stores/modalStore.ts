import { create } from "zustand";

export type ModalType =
  | "auth"
  | "changePassword"
  | "createTransaction"
  | "deleteAccount"
  | "deleteGoal"
  | "editProfile"
  | null;

interface ModalState {
  type: ModalType;
  props: Record<string, any>;
  isOpen: boolean;
  openModal: (type: ModalType, props?: Record<string, any>) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  type: null,
  props: {},
  isOpen: false,
  openModal: (type, props = {}) => set({ isOpen: true, type, props }),
  closeModal: () => set({ isOpen: false, type: null, props: {} }),
}));
