"use client";

import { Suspense } from "react";
import ActivityCard from "./activity-card";

interface ActivityCardWrapperProps {
  activity: any;
}

function ActivityCardWrapper({ activity }: ActivityCardWrapperProps) {
  return <ActivityCard activity={activity} />;
}

interface ActivityCardWithSuspenseProps {
  activity: any;
}

export default function ActivityCardWithSuspense({ activity }: ActivityCardWithSuspenseProps) {
  return (
    <Suspense fallback={
      <div className="border-brand-gray-100 bg-brand-white flex flex-col gap-2 rounded-lg border-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-brand-gray-200 animate-pulse flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white text-sm font-medium"></div>
            <div className="bg-brand-gray-200 animate-pulse h-4 w-32 rounded"></div>
          </div>
          <div className="bg-brand-gray-200 animate-pulse h-4 w-16 rounded text-xs"></div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="bg-brand-gray-200 animate-pulse h-3 w-24 rounded text-xs"></div>
          <div className="bg-brand-gray-200 animate-pulse h-3 w-20 rounded text-xs"></div>
        </div>
      </div>
    }>
      <ActivityCardWrapper activity={activity} />
    </Suspense>
  );
}