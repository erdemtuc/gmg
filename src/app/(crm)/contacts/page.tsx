import { Suspense } from "react";
import { ReactComponent as AddOutlinedCircleIcon } from "@/icons/add-outlined-circle-icon.svg";
import { ReactComponent as ChevronOutlinedUpIcon } from "@/icons/chevron-outlined-up-icon.svg";
import ContactList from "./contact-list";
import { ContactAddModal } from "./contact-add-modal";
import { ContactEditModal } from "./contact-edit-modal";
import { AddNewButton } from "./add-new-button";
import { ContactDetailModal } from "./contact-detail-modal";

export default function ContactsPage() {
  return (
    <div className="bg-brand-white flex min-h-0 flex-1 flex-col space-y-2 overflow-hidden rounded-lg p-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-brand-gray-600 text-lg leading-1 font-medium">
          Contacts / Clients
        </h1>
        <AddNewButton />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-start flex items-center gap-2">
          <button className="text-brand-primary-500 bg-brand-primary-50 hover:bg-brand-primary-100 flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5">
            <span className="text-sm leading-1">Add filters</span>
            <AddOutlinedCircleIcon className="size-3.5" />
          </button>
          <span className="text-brand-gray-300 text-xs">
            Add filter to begin your contact/client search...
          </span>
        </div>
        <button className="text-brand-gray-400 no-background flex cursor-pointer items-center gap-1.5 rounded-md">
          <span className="text-sm">Sort by</span>
          <ChevronOutlinedUpIcon className="size-3.5 rotate-180" />
        </button>
      </div>
      <ContactList />
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
