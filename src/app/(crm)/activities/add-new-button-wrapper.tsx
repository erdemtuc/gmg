"use client";

import { Suspense } from "react";
import { AddNewButton } from "./add-new-button";

function AddNewButtonWrapper() {
  return <AddNewButton />;
}

export default function AddNewButtonWithSuspense() {
  return (
    <Suspense fallback={<button className="bg-brand-primary-500 text-brand-white h-10 rounded-md px-4 py-2 text-sm font-medium opacity-50 cursor-not-allowed">Add New</button>}>
      <AddNewButtonWrapper />
    </Suspense>
  );
}