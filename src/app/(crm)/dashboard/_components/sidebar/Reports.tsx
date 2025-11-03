import React from "react";

// Placeholder icons - you may need to replace these with actual icons from your icon library
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const TargetIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ListIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const ChevronOutlinedUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const reports = [
  { id: "individuals", label: "Individuals", records: 82, Icon: UserIcon },
  { id: "companies", label: "Companies", records: 100, Icon: BuildingIcon },
  { id: "prospect-list", label: "Prospect List", records: 100, Icon: TargetIcon },
  { id: "lead-list", label: "Lead List", records: 100, Icon: ListIcon },
];

export default function Reports() {
  return (
    <div className="bg-brand-white rounded-lg px-4 pt-4 pb-2">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-brand-gray-600 text-base font-medium">Reports</h2>
        <button className="no-background">
          <span className="text-brand-primary-500 hover:bg-brand-gray-100 cursor-pointer rounded p-1 text-xs font-medium">
            New Report
          </span>
        </button>
      </div>
      <div className="divide-brand-gray-200 divide-y">
        {reports.map((item) => (
          <div
            key={item.id}
            className="hover:bg-brand-gray-100 flex cursor-pointer items-start justify-between rounded px-1 py-2"
          >
            <div className="flex items-center gap-2">
              <item.Icon className="text-brand-primary-600 size-4" />
              <div className="flex flex-col">
                <span className="text-brand-gray-600 text-sm font-normal">
                  {item.label}
                </span>
                <span className="text-brand-gray-400 text-xs font-normal">
                  {item.records} records
                </span>
              </div>
            </div>
            <ChevronOutlinedUpIcon className="text-brand-gray-300 size-4 rotate-90 self-center" />
          </div>
        ))}
      </div>
    </div>
  );
}
