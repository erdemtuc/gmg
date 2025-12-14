import React from "react";
import { ExternalLink } from "lucide-react";

const agendaItems = [
  {
    time: "1:30 pm",
    text: "For Jeff Karsten Lilia added task/activity Accept invoice: Crawford",
    avatar: "L",
  },
  {
    time: "1:30 pm",
    text: "Kephart Feed and Farm Supply - Galesburg - Neosho",
    avatar: "L",
  },
  {
    time: "1:30 pm",
    text: "Farmers Cooperative Association - Baxter Springs - Cherokee",
    avatar: "L",
  },
  {
    time: "1:30 pm",
    text: "Farmers Cooperative Association - Baxter Springs - Cherokee",
    avatar: "L",
  },
];

export const Agenda: React.FC = () => {
  return (
    <div className="sticky top-6 h-fit rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-gray-900">Agenda</h2>
        <select className="rounded border border-gray-300 bg-white px-2 py-1 text-xs hover:bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option>All users</option>
          <option>My tasks</option>
          <option>Team tasks</option>
        </select>
      </div>

      {/* Stats */}
      <div className="mb-4 border-b border-gray-200 pb-4">
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold text-gray-900">324</div>
          <div className="flex items-center gap-1 text-sm font-medium text-green-600">
            <span>↑</span>
            <span>2.5%</span>
          </div>
        </div>
        <div className="mt-1 text-xs text-gray-600">Tasks for March 2025</div>
      </div>

      {/* Buttons */}
      <div className="mb-4 flex gap-2">
        <button className="flex-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700">
          Show completed
        </button>
        <button className="inline-flex flex-1 items-center justify-center gap-1 rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50">
          View details
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      {/* Agenda Items */}
      <div className="space-y-3">
        {agendaItems.map((item, index) => (
          <div
            key={index}
            className="flex cursor-pointer gap-3 rounded border-b border-gray-100 p-1.5 pb-3 transition-colors last:border-0 last:pb-0 hover:bg-gray-50"
          >
            {/* Avatar */}
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {item.avatar}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-xs leading-snug text-gray-700">
                {item.text}
              </p>
              <p className="mt-1 text-xs text-gray-500">By: Lilia Olianovska</p>
            </div>

            {/* Time */}
            <div className="flex-shrink-0 text-xs font-medium whitespace-nowrap text-gray-600">
              {item.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
