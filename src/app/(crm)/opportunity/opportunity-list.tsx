"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClientGet } from "@/infra/http/client";
import { Opportunity } from "@/features/shared/models/opportunity-crud-models";
import { Star, User, ChevronDown } from "lucide-react";
import { useOpportunityFilters } from "./use-opportunity-filters";
import { useUIStore } from "@/stores/ui";

const PAGE_START = 1;

interface OpportunityListProps {
  showFilters?: boolean;
  showSort?: boolean;
}

export default function OpportunityList({ showFilters, showSort }: OpportunityListProps) {
  const { filters, sort } = useOpportunityFilters();

  const query = useInfiniteQuery({
    queryKey: ["opportunities", filters, sort],
    initialPageParam: PAGE_START,
    queryFn: async ({ pageParam }) => {
      const page = typeof pageParam === "number" ? pageParam : PAGE_START;

      // Build query parameters
      const queryParams: Record<string, any> = { page };

      // Add filter parameters
      if (filters.length > 0) {
        filters.forEach((filter, index) => {
          queryParams[`filter[${index}][field]`] = filter.field;
          queryParams[`filter[${index}][operator]`] = filter.operator;
          queryParams[`filter[${index}][value]`] = filter.value;
        });
      }

      // Add sort parameters
      if (sort && sort.field) {
        queryParams['sort'] = sort.field;
        queryParams['direction'] = sort.direction;
      }

      return apiClientGet<Opportunity[]>("/api/opportunities", { query: queryParams });
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + PAGE_START : undefined;
    },
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } = query;

  if (status === "pending") {
    return <div className="p-4 text-sm">Loading…</div>;
  }
  if (status === "error") {
    return (
      <div className="p-4 text-sm text-red-600">
        {(error as Error)?.message || "Failed to load"}
      </div>
    );
  }

  const opportunities = (data?.pages ?? []).flat();

  return (
    <div className="flex flex-col gap-2 overflow-y-auto pb-4">
      {opportunities.map((opp) => (
        <OpportunityCard key={opp.id} opportunity={opp} />
      ))}
      
      {hasNextPage && (
        <div className="flex justify-center mt-2">
          <button 
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-full bg-white p-1 shadow-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronDown className={`h-6 w-6 text-blue-500 ${isFetchingNextPage ? 'animate-bounce' : ''}`} />
          </button>
        </div>
      )}
      
      {!hasNextPage && opportunities.length > 0 && (
        <div className="text-center text-xs text-gray-400 mt-2">No more opportunities</div>
      )}
      
      {opportunities.length === 0 && (
        <div className="text-center text-sm text-gray-500 mt-4">No opportunities found</div>
      )}
    </div>
  );
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const openOpportunityDetail = useUIStore((s) => s.modalState.openOpportunityDetail);

  // Helper to get field value safely
  const getFieldValue = (fieldName: string) => {
    // Check additionalFields first
    const field = opportunity.additionalFields?.find(f => f.name === fieldName);
    if (field) return field.value;
    
    // Check Lines if needed (though getOpportunities usually maps Lines to additionalFields)
    return null;
  };

  const isAccepted = opportunity.status === "Accepted";
  const statusColor = isAccepted ? "text-green-600" : "text-blue-600";
  const iconBg = isAccepted ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600";

  // Mocking some fields if they don't exist in standard Opportunity model, 
  // but trying to retrieve them from additionalFields if available.
  const filesCount = getFieldValue("filesCount");
  const jobId = getFieldValue("jobId");
  const sentBy = getFieldValue("sentBy");
  const responsible = opportunity.assignedTo || getFieldValue("responsible");

  const handleClick = () => {
    openOpportunityDetail(String(opportunity.id));
  };

  return (
    <div 
      onClick={handleClick}
      className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Icon Column */}
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        {isAccepted ? (
          <Star className="h-5 w-5 fill-current" />
        ) : (
          <User className="h-5 w-5 fill-current" />
        )}
      </div>

      {/* Content Column */}
      <div className="flex flex-1 flex-col gap-3">
        {/* Header Row */}
        <div className="flex items-start justify-between">
          <h3 className="text-base font-medium text-gray-900">
            {opportunity.name}
          </h3>
          <span className={`text-sm font-medium ${statusColor}`}>
            {opportunity.status}
          </span>
        </div>

        {/* Horizontal Divider */}
        <div className="h-px w-full bg-gray-100" />

        {/* Details Row */}
        <div className="flex items-center w-full">
          {/* Left Block: Quote Amount */}
          <div className="flex flex-1 items-center justify-between pr-4">
             <span className="text-xs text-gray-500">Quote Amount</span>
             <span className="text-sm font-semibold text-gray-900">${Number(opportunity.value).toLocaleString()}</span>
          </div>
          
          {/* Vertical Divider */}
          <div className="h-4 w-px bg-gray-200 mx-2" />
          
          {/* Right Block: Valid Through */}
          <div className="flex flex-1 items-center justify-between pl-4">
             <span className="text-xs text-gray-500">Valid through</span>
             <span className="text-sm text-gray-900">{opportunity.expectedCloseDate || '-'}</span>
          </div>
        </div>
        
        {/* Extra details row if available */}
        {(filesCount || jobId || sentBy || responsible) && (
          <>
            <div className="h-px w-full bg-gray-100" />
            <div className="grid grid-cols-12 gap-4">
              {filesCount && (
                <div className="col-span-6 sm:col-span-3">
                  <p className="text-xs text-gray-500">Files/Images</p>
                  <p className="text-sm text-blue-600 cursor-pointer hover:underline">
                    Open
                  </p>
                </div>
              )}
              
              {jobId && (
                <div className="col-span-6 sm:col-span-3">
                  <p className="text-xs text-gray-500">Job</p>
                  <p className="text-sm text-blue-600 cursor-pointer hover:underline">
                    {String(jobId)}
                  </p>
                </div>
              )}

              {sentBy && (
                <div className="col-span-6 sm:col-span-3">
                  <p className="text-xs text-gray-500">Sent by</p>
                  <p className="text-sm text-gray-900">{String(sentBy)}</p>
                </div>
              )}

              {responsible && (
                <div className="col-span-6 sm:col-span-3">
                  <p className="text-xs text-gray-500">Responsible</p>
                  <p className="text-sm text-blue-600 cursor-pointer hover:underline">
                    {String(responsible)}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}