"use client";

import { Activity } from "@/features/shared/models/activity-crud-models";
import { useUIStore } from "@/stores/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClientGet } from "@/infra/http/client";
import type { ActivityDetail } from "@/features/shared/models/activity-crud-models";

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const openActivityDetail = useUIStore((s) => s.modalState.openActivityDetail);
  const queryClient = useQueryClient();

  const handleClick = () => {
    const sp = new URLSearchParams(Array.from(searchParams.entries()));
    sp.set("activity_detail_id", String(activity.id));
    router.replace(`?${sp.toString()}`, { scroll: false });
    openActivityDetail(activity.id);
  };

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ["activityDetail", activity.id],
      queryFn: () =>
        apiClientGet<ActivityDetail>(`/api/activities/${activity.id}`),
    });
  };

  // Determine status color
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("completed") || statusLower.includes("done")) {
      return "text-green-600";
    }
    if (statusLower.includes("pending") || statusLower.includes("in progress")) {
      return "text-blue-600";
    }
    if (statusLower.includes("overdue") || statusLower.includes("late")) {
      return "text-red-600";
    }
    return "text-gray-600";
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className="border-brand-gray-100 bg-brand-white hover:bg-brand-gray-50 flex cursor-pointer flex-col gap-2 rounded-lg border-1 p-4 transition-colors"
    >
      {/* Activity name/title */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="bg-brand-primary-500 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-white text-sm font-medium">
            {activity.name?.charAt(0)?.toUpperCase() || "T"}
          </div>
          <h3 className="text-brand-gray-900 text-sm font-medium line-clamp-2">
            {activity.name || "Untitled Task"}
          </h3>
        </div>
        <span className={`text-xs font-medium ${getStatusColor(activity.status)}`}>
          {activity.status}
        </span>
      </div>

      {/* Activity details */}
      <div className="flex flex-col gap-1 text-xs">
        {activity.dueDate && (
          <div className="flex items-center justify-between">
            <span className="text-brand-gray-400">Due Date:</span>
            <span className="text-brand-gray-600">{activity.dueDate}</span>
          </div>
        )}
        {activity.assignedTo && (
          <div className="flex items-center justify-between">
            <span className="text-brand-gray-400">Assigned To:</span>
            <span className="text-brand-gray-600">{activity.assignedTo}</span>
          </div>
        )}
        {activity.createdAt && (
          <div className="flex items-center justify-between">
            <span className="text-brand-gray-400">Created:</span>
            <span className="text-brand-gray-600">{activity.createdAt}</span>
          </div>
        )}
      </div>

      {/* Additional fields */}
      {activity.additionalFields && activity.additionalFields.length > 0 && (
        <div className="border-brand-gray-100 mt-2 flex flex-wrap gap-2 border-t-1 pt-2">
          {activity.additionalFields.slice(0, 3).map((field, idx) => (
            <div key={idx} className="text-xs">
              <span className="text-brand-gray-400">{field.name}: </span>
              <span className="text-brand-gray-600">
                {Array.isArray(field.value) && field.multi === 1 ? (
                  <div className="flex flex-col gap-1">
                    {field.value.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex justify-between">
                        <span className="flex items-center justify-center bg-gray-200 text-[10px] font-medium text-gray-700 min-w-[18px] h-fit px-1">
                          {itemIdx + 1}
                        </span>
                        <span className="text-right max-w-[70%] truncate">{String(item)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  String(field.value)
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
