"use client";

import { Upload } from "lucide-react";

export function FilesTabContent() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-4 text-center">
      <div className="flex flex-col gap-1">
        <h3 className="text-black  text-sm font-bold">
          No Files & Images
        </h3>
        <p className="text-brand-gray-500 text-xs">
          You don't have any Files & Images added yet
        </p>
      </div>
      
      <div className="border-brand-primary-500 flex w-full max-w-xs cursor-pointer flex-row items-center justify-center gap-2 rounded-lg border border-dashed py-3 transition-colors">
        <Upload className="text-brand-gray-400 size-4" />
        <span className="text-brand-gray-500 text-xs">
          Drag & Drop files here or{" "}
          <span className="text-blue-600 font-medium hover:underline">
            Upload file
          </span>
        </span>
      </div>
    </div>
  );
}
