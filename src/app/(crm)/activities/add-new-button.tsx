"use client";

import { useUIStore } from "@/stores/ui";
import { useRouter, useSearchParams } from "next/navigation";

export function AddNewButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openActivityAdd = useUIStore((s) => s.modalState.openActivityAdd);

  const handleClick = () => {
    const sp = new URLSearchParams(Array.from(searchParams.entries()));
    sp.set("activity_add", "true");
    router.replace(`?${sp.toString()}`, { scroll: false });
    openActivityAdd();
  };

  return (
    <button
      onClick={handleClick}
      className="bg-brand-primary-500 hover:ring-brand-primary-100 active:bg-brand-primary-600 text-brand-white h-10 cursor-pointer rounded-md px-4 py-2 text-sm font-medium hover:ring-4 active:ring-0"
    >
      Add New
    </button>
  );
}
