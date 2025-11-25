"use client";

import { Suspense, useState } from "react";
import ActivityList from "./activity-list";
import AddNewButtonWithSuspense from "./add-new-button-wrapper";
import { ActivityDetailModal } from "./activity-detail-modal";
import { ActivityAddModal } from "./activity-add-modal";
import { ActivityEditModal } from "./activity-edit-modal";

export default function ActivitiesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  return (
    <div className="bg-brand-white flex min-h-0 flex-1 flex-col space-y-2 overflow-hidden rounded-lg p-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-brand-gray-600 text-lg leading-1 font-medium">
          Tasks & Activities
        </h1>
        <AddNewButtonWithSuspense />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-start flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-brand-primary-500 hover:text-brand-primary-600 text-xs font-medium cursor-pointer"
          >
            Add filters
          </button>
          {!showFilters && (
            <span className="text-brand-gray-300 text-xs flex-1">
              Add filter to begin your activity search...
            </span>
          )}
        </div>
        <button
          onClick={() => setShowSort(!showSort)}
          className="text-brand-gray-600 hover:text-brand-gray-700 text-xs font-medium cursor-pointer"
        >
          Sort by ▼
        </button>
      </div>
      <ActivityList filters={undefined} sort={undefined} />
      <Suspense fallback={null}>
        <ActivityDetailModal />
      </Suspense>
      <Suspense fallback={null}>
        <ActivityAddModal />
      </Suspense>
      <Suspense fallback={null}>
        <ActivityEditModal />
      </Suspense>
    </div>
  );
}
