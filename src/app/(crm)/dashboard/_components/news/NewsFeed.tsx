"use client";

import React from "react";
import { Filter } from "lucide-react";

const newsItems = [
  {
    id: 1,
    day: "23",
    month: "Mar",
    text: "For Jeff Karsten Lilia added task/activity Accept invoice: Crawford",
    time: "Last week (Mar 20) 4:35 pm",
  },
  {
    id: 2,
    day: "23",
    month: "Mar",
    text: "Western Feed Mills - Cedar Vale - Chaurauqua",
    time: "Last week (Mar 20) 4:35 pm",
    subItems: [
      "Farmers Cooperative Association - Baxter Springs - Cherokee - (620) 8562365",
      "Kephart Feed and Farm Supply - Galesburg - Neosho",
      "For Jeff Karsten Lilia added task/activity Accept invoice: Crawford",
    ],
  },
  {
    id: 3,
    day: "23",
    month: "Mar",
    text: "Producers Cooperative Association - Girard - Crawford",
    time: "Last week (Mar 20) 4:35 pm",
  },
  {
    id: 4,
    day: "23",
    month: "Mar",
    text: "Producers Cooperative Association - Girard - Crawford",
    time: "Last week (Mar 20) 4:35 pm",
  },
  {
    id: 5,
    day: "23",
    month: "Mar",
    text: "Producers Cooperative Association - Girard - Crawford",
    time: "Last week (Mar 20) 4:35 pm",
  },
];

export const NewsFeed: React.FC = () => {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="text-sm font-semibold text-gray-900">News Feed</h2>
        <button className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50">
          <Filter className="h-4 w-4 text-gray-500" />
          <span>Filter</span>
        </button>
      </div>

      {/* News Items */}
      <div className="divide-y divide-gray-200">
        {newsItems.map((item) => (
          <div key={item.id} className="px-6 py-4">
            <div className="flex gap-4">
              {/* Date Box */}
              <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded bg-blue-100 text-center">
                <div className="text-lg font-bold text-blue-600">
                  {item.day}
                </div>
                <div className="text-xs font-medium text-blue-600">
                  {item.month}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.text}
                  </p>
                  {item.subItems && (
                    <div className="mt-3 space-y-2 text-sm text-gray-700">
                      {item.subItems.map((subItem, idx) => (
                        <p key={idx}>{subItem}</p>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0 text-right">
                  <p className="text-xs whitespace-nowrap text-gray-500">
                    {item.time}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
