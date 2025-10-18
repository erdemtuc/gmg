import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ContactType } from "@/features/shared/models/contact-crud-models";

type MenuState = {
  isMenuCollapsed: boolean;
  toggleMenu: () => void;
  setMenuCollapsed: (v: boolean) => void;
};

type UIState = {
  menuState: MenuState;
  modalState: ModalState;
};

type ModalState = {
  active:
    | { type: "contactDetail"; contactId: string }
    | { type: "contactAdd"; contactType: ContactType | null }
    | { type: "contactEdit"; contactId: string }
    | null;
  openContactDetail: (contactId: string) => void;
  openContactAdd: (contactType: ContactType | null) => void;
  openContactEdit: (contactId: string) => void;
  closeModal: () => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      menuState: {
        isMenuCollapsed: false,
        toggleMenu: () =>
          set((s) => ({
            menuState: {
              ...s.menuState,
              isMenuCollapsed: !s.menuState.isMenuCollapsed,
            },
          })),
        setMenuCollapsed: (v) =>
          set((s) => ({
            menuState: {
              ...s.menuState,
              isMenuCollapsed: v,
            },
          })),
      },
      modalState: {
        active: null,
        openContactDetail: (contactId) =>
          set((s) => ({
            modalState: {
              ...s.modalState,
              active: { type: "contactDetail", contactId },
            },
          })),
        openContactAdd: (contactType) =>
          set((s) => ({
            modalState: {
              ...s.modalState,
              active: { type: "contactAdd", contactType },
            },
          })),
        openContactEdit: (contactId) =>
          set((s) => ({
            modalState: {
              ...s.modalState,
              active: { type: "contactEdit", contactId },
            },
          })),
        closeModal: () =>
          set((s) => ({
            modalState: { ...s.modalState, active: null },
          })),
      },
    }),
    {
      name: "ui.v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        menuState: { isMenuCollapsed: state.menuState.isMenuCollapsed },
      }),
    },
  ),
);
