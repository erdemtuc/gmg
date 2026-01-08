"use client";

import { Suspense, useState } from "react";
import ContactList from "./contact-list";
import { ContactAddModal } from "./contact-add-modal";
import { ContactEditModal } from "./contact-edit-modal";
import { AddNewButton } from "./add-new-button";
import { ContactDetailModal } from "./contact-detail-modal";
import { ContactFilters } from "./contact-filters";
import { ContactSortComponent } from "./contact-sort";
import { useContactFilters } from "./use-contact-filters";

export default function ContactsPage() {
  const [showSort, setShowSort] = useState(false);
  const filterState = useContactFilters();

  return (
    <div className="bg-brand-white flex min-h-0 flex-1 flex-col space-y-2 overflow-hidden rounded-lg p-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-brand-gray-600 text-lg leading-1 font-medium">
          Contacts / Clients
        </h1>
        <AddNewButton />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-start flex items-center gap-2 flex-wrap">
          <ContactFilters />
          {filterState.filters.length === 0 && (
            <span className="text-brand-gray-300 text-xs">
              Add filter to begin your contact/client search...
            </span>
          )}
        </div>
        <ContactSortComponent 
          showSort={showSort} 
          onToggleSort={() => setShowSort(!showSort)} 
        />
      </div>
      <ContactList 
        filters={filterState.filters}
        sort={filterState.sort}
      />
      <Suspense fallback={null}>
        <ContactDetailModal />
      </Suspense>
      <Suspense fallback={null}>
        <ContactAddModal />
      </Suspense>
      <Suspense fallback={null}>
        <ContactEditModal />
      </Suspense>
    </div>
  );
}
