"use client";

import { useState, useEffect } from "react";
import { Activity } from "@/features/shared/models/activity-crud-models";

export default function ActivitiesTable() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/activities?page=1");
        
        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = "/login?next=/activities";
            return;
          }
          throw new Error("Failed to fetch activities");
        }
        
        const data = await response.json();
        setActivities(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
        setError("Failed to load activities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-brand-gray-600">Loading activities...</div>
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Additional Fields
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.dueDate ? new Date(activity.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.assignedTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.additionalFields && activity.additionalFields.length > 0 ? (
                        <div>
                          {activity.additionalFields.slice(0, 2).map((field, idx) => (
                            <div key={idx} className="truncate">
                              <span className="font-medium">{field.name}:</span>{" "}
                              {Array.isArray(field.value) && field.multi === 1 ? (
                                <div className="flex flex-col gap-1">
                                  {field.value.map((item, itemIdx) => (
                                    <div key={itemIdx} className="flex justify-between">
                                      <span className="flex items-center justify-center bg-gray-200 text-[10px] font-medium text-gray-700 min-w-[18px] h-fit px-1">
                                        {itemIdx + 1}
                                      </span>
                                      <span className="text-xs text-right max-w-[70%] truncate">{String(item)}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                field.value
                              )}
                            </div>
                          ))}
                          {activity.additionalFields.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{activity.additionalFields.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : 'None'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No activities found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}