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
    | { type: "activityDetail"; activityId: number }
    | { type: "activityAdd" }
    | { type: "activityEdit"; activityId: number }
    | null;
  openContactDetail: (contactId: string) => void;
  openContactAdd: (contactType: ContactType | null) => void;
  openContactEdit: (contactId: string) => void;
  openActivityDetail: (activityId: number) => void;
  openActivityAdd: () => void;
  openActivityEdit: (activityId: number) => void;
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
        openActivityDetail: (activityId) =>
          set((s) => ({
            modalState: {
              ...s.modalState,
              active: { type: "activityDetail", activityId },
            },
          })),
        openActivityAdd: () =>
          set((s) => ({
            modalState: {
              ...s.modalState,
              active: { type: "activityAdd" },
            },
          })),
        openActivityEdit: (activityId) =>
          set((s) => ({
            modalState: {
              ...s.modalState,
              active: { type: "activityEdit", activityId },
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
