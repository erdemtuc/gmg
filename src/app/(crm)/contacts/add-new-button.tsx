"use client";

import { useUIStore } from "@/stores/ui";

export function AddNewButton() {
  const openAdd = useUIStore((s) => s.modalState.openContactAdd);

  return (
    <button
      className="bg-brand-primary-500 hover:bg-brand-primary-400 cursor-pointer rounded-md px-2 py-1.5"
      onClick={() => openAdd(null)}
    >
      <span className="text-brand-white text-base font-medium">Add New</span>
    </button>
  );
}
