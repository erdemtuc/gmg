"use client";

import { Suspense, useState } from "react";
import ActivityList from "./activity-list";
import AddNewButtonWithSuspense from "./add-new-button-wrapper";
import { ActivityDetailModal } from "./activity-detail-modal";
import { ActivityAddModal } from "./activity-add-modal";
import { ActivityEditModal } from "./activity-edit-modal";
import { ActivityFilters } from "./activity-filters";
import { ActivitySortComponent } from "./activity-sort";
import { useActivityFilters } from "./use-activity-filters";

export default function ActivitiesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const filterState = useActivityFilters();

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
          <ActivityFilters
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
          {!showFilters && (
            <span className="text-brand-gray-300 text-xs flex-1">
              Add filter to begin your activity search...
            </span>
          )}
        </div>
        <ActivitySortComponent
          showSort={showSort}
          onToggleSort={() => setShowSort(!showSort)}
        />
      </div>
      <ActivityList
        filters={filterState.filters}
        sort={filterState.sort}
      />
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
