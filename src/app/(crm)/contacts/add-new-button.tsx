"use client";

import { useUIStore } from "@/stores/ui";

export function AddNewButton() {
  const openAdd = useUIStore((s) => s.modalState.openContactAdd);

  return (
    <button
      className="bg-brand-primary-500 hover:bg-brand-primary-400 cursor-pointer items-center rounded-md px-2 py-1.5"
      onClick={() => openAdd(null)}
    >
      <span className="text-brand-white self-center text-xs">Add New</span>
    </button>
  );
}
