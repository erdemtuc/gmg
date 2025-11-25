"use client";

import { useState } from "react";
import ProposalList from "./proposal-list";
import { PlusCircle, ChevronDown } from "lucide-react";

export default function ProposalsPage() {
  return (
    <div className="bg-brand-white flex min-h-0 flex-1 flex-col space-y-2 overflow-hidden rounded-lg p-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-brand-gray-600 text-lg leading-1 font-medium">
          Proposal
        </h1>
        <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
          Add New
        </button>
      </div>
      
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium bg-blue-50 px-3 py-1.5 rounded-md transition-colors">
            Add filters
            <PlusCircle className="h-4 w-4" />
          </button>
          <span className="text-gray-400 text-sm hidden sm:inline-block">
            Add filter to begin your contact/client search...
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">Sort by</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <ProposalList />
    </div>
  );
}
