"use client";

import { useState } from "react";
import { useUIStore } from "@/stores/ui";
import OpportunityList from "./opportunity-list";
import { PlusCircle, ChevronDown } from "lucide-react";
import { OpportunityFilters } from "./opportunity-filters";
import { OpportunitySortComponent } from "./opportunity-sort";
import { OpportunityAddModal } from "./opportunity-add-modal";
import { OpportunityDetailModal } from "./opportunity-detail-modal";
import { OpportunityEditModal } from "./opportunity-edit-modal";

export default function OpportunityPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Subscribe to UI store for modal state
  const activeModal = useUIStore((state) => state.modalState.active);

  const isOpportunityDetailOpen = activeModal?.type === 'opportunityDetail';
  const opportunityDetailId = isOpportunityDetailOpen ? activeModal.opportunityId : undefined;
  const isOpportunityEditOpen = activeModal?.type === 'opportunityEdit';
  const opportunityEditId = isOpportunityEditOpen ? activeModal.opportunityId : undefined;

  return (
    <div className="bg-brand-white flex min-h-0 flex-1 flex-col space-y-2 overflow-hidden rounded-lg p-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-brand-gray-600 text-lg leading-1 font-medium">
          Opportunity
        </h1>
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          onClick={() => setShowAddModal(true)}
        >
          Add New
        </button>
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <OpportunityFilters
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
          {!showFilters && (
            <span className="text-gray-400 text-sm hidden sm:inline-block">
              Add filter to begin your opportunity search...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <OpportunitySortComponent
            showSort={showSort}
            onToggleSort={() => setShowSort(!showSort)}
          />
        </div>
      </div>

      <OpportunityList
        showFilters={showFilters}
        showSort={showSort}
      />

      {showAddModal && (
        <OpportunityAddModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Opportunity Detail Modal - rendered when UI store has an active opportunity detail modal */}
      <OpportunityDetailModal
        isOpen={isOpportunityDetailOpen}
        onClose={() => useUIStore.getState().modalState.closeModal()}
        opportunityId={opportunityDetailId}
      />

      {/* Opportunity Edit Modal - rendered when UI store has an active opportunity edit modal */}
      <OpportunityEditModal
        isOpen={isOpportunityEditOpen}
        onClose={() => useUIStore.getState().modalState.closeModal()}
        opportunityId={opportunityEditId}
      />
    </div>
  );
}