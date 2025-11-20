"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { apiClientGet } from "@/infra/http/client";
import type { Activity } from "@/features/shared/models/activity-crud-models";
import ActivityCardWithSuspense from "./activity-card-wrapper";

interface ActivityListProps {
  filters?: unknown;
  sort?: unknown;
}

export default function ActivityList({ filters, sort }: ActivityListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["activities", filters, sort],
    queryFn: ({ pageParam = 1 }) =>
      apiClientGet<Activity[]>("/api/activities", {
        query: { page: pageParam },
      }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) return undefined;
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <div className="text-brand-gray-400 p-4 text-center text-sm">
        Loading activities...
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="p-4 text-center text-sm text-red-600">
        Error: {(error as Error)?.message || "Failed to load activities"}
      </div>
    );
  }

  const allActivities = data?.pages.flatMap((page) => page) ?? [];

  if (allActivities.length === 0) {
    return (
      <div className="text-brand-gray-400 p-4 text-center text-sm">
        No activities found
      </div>
    );
  }

  return (
    <div className="scroll-thin scrollbar-on-white scrollbar-gutter:stable flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pb-4">
      {allActivities.map((activity) => (
        <ActivityCardWithSuspense key={activity.id} activity={activity} />
      ))}
      <div ref={observerTarget} className="h-4">
        {isFetchingNextPage && (
          <div className="text-brand-gray-400 text-center text-xs">
            Loading more...
          </div>
        )}
      </div>
    </div>
  );
}
