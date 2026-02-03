import { Contact } from "@/features/shared/models/contact-crud-models";
import { useUIStore } from "@/stores/ui";
import { usePathname, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { apiClientGet } from "@/infra/http/client";
import { ContactDetail } from "@/features/shared/models/contact-crud-models";
import { useRef, useState } from "react";
import { ChevronDown, ExternalLink, Copy } from "lucide-react";

export default function ContactCard({ contact }: { contact: Contact }) {
  const openContact = useUIStore((s) => s.modalState.openContactDetail);
  const pathname = usePathname();
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const hoverPrefetchTimeoutRef = useRef<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const prefetchContactDetail = () => {
    const key = ["contact", String(contact.id)];
    const state = queryClient.getQueryState<ContactDetail>(key);
    const now = Date.now();

    if (
      state?.status === "success" &&
      state.dataUpdatedAt &&
      now - state.dataUpdatedAt < 30_000
    ) {
      return;
    }
    queryClient.prefetchQuery({
      queryKey: key,
      queryFn: () => apiClientGet<ContactDetail>(`/api/contacts/${contact.id}`),
      staleTime: 30_000,
      gcTime: 2 * 60_000,
    });
  };

  const open = () => {
    openContact(String(contact.id));
    const newSearchParams = new URLSearchParams(params.toString());
    newSearchParams.set("contact_id", String(contact.id));
    const newUrl = `${pathname}?${newSearchParams.toString()}`;
    window.history.pushState(null, "", newUrl);
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  // Extract specific fields for detailed view
  const getFieldValue = (fieldName: string) => {
    const field = contact.additionalFields.find(f => f.name.toLowerCase() === fieldName.toLowerCase());
    return field?.value?.toString() || '';
  };

  const webPage = getFieldValue('web page') || getFieldValue('website') || getFieldValue('url');
  const channel = getFieldValue('channel') || getFieldValue('source channel');
  const source = getFieldValue('source') || getFieldValue('lead source');

  // Use all available fields from the API (not just specific status fields)
  const displayFields = contact.additionalFields.filter(field =>
    field.name && field.value && field.value.toString().trim() !== ''
  );

  // Toggle active status handler
  const toggleActiveStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real implementation, this would update the contact status via API
    console.log(`Toggling active status for contact ${contact.name}`);
  };

  // Handle opening/copying web page
  const handleWebPageAction = (action: 'open' | 'copy', e: React.MouseEvent) => {
    e.stopPropagation();
    if (webPage) {
      if (action === 'open') {
        window.open(webPage, '_blank');
      } else if (action === 'copy') {
        navigator.clipboard.writeText(webPage);
      }
    }
  };

  return (
    <div
      className="bg-brand-white border-brand-gray-200 hover:border-brand-primary-200 relative cursor-pointer overflow-hidden rounded-2xl border transition-colors duration-200 ease-in-out"
      onClick={open}
      onMouseEnter={() => {
        if (hoverPrefetchTimeoutRef.current != null) {
          window.clearTimeout(hoverPrefetchTimeoutRef.current);
        }
        hoverPrefetchTimeoutRef.current = window.setTimeout(() => {
          prefetchContactDetail();
          hoverPrefetchTimeoutRef.current = null;
        }, 150);
      }}
      onMouseLeave={() => {
        if (hoverPrefetchTimeoutRef.current != null) {
          window.clearTimeout(hoverPrefetchTimeoutRef.current);
          hoverPrefetchTimeoutRef.current = null;
        }
      }}
      onFocus={prefetchContactDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          prefetchContactDetail();
          open();
        }
      }}
    >
      {/* Top section with status tag */}
      <div className="relative p-4 pt-6">
        <div className="absolute top-4 right-4">
          <span className="rounded  px-2 py-1 text-xs font-semibold whitespace-nowrap text-blue-600">
            {contact.type || "Prospect"}
          </span>
        </div>

        {/* Avatar and primary identification */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full  bg-brand-primary-600 text-white border border-brand-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-1/2 h-1/2">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base text-black mb-1">{contact.name}</div>
            <div className="text-sm text-brand-gray-600">
              {getFieldValue('organization') || getFieldValue('company') || getFieldValue('business')}
            </div>
            <div className="text-sm text-brand-gray-600 mt-1">
              {getFieldValue('phone') || getFieldValue('mobile') || getFieldValue('telephone')}
            </div>
          </div>
        </div>

        {/* Separator: Primary header to Active/Inactive */}
        <div className="border-t border-brand-gray-100 my-3"></div>

        {/* Dynamic information from API */}
        <div className="grid grid-cols-2 gap-x-4 mb-4 relative">
          {/* Vertical divider line between columns */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 transform bg-brand-gray-100"></div>

          {/* Display available fields dynamically - showing only 1 row by default */}
          <div className="space-y-3 pr-2">
            {displayFields.slice(0, 1).map((field, index) => (
              <div key={field.name} className="flex items-center justify-between">
                <span className="text-xs text-brand-gray-600 capitalize">{field.name}:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-black">{field.value?.toString()}</span>
                </div>
              </div>
            ))}
            {/* Fill empty slot if less than 1 field */}
            {displayFields.length < 1 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-gray-600">Info:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-black">N/A</span>
                </div>
              </div>
            )}
          </div>

          {/* Second column for remaining fields */}
          <div className="space-y-3 pl-2">
            {displayFields.slice(1, 2).map((field) => (
              <div key={field.name} className="flex items-center justify-between">
                <span className="text-xs text-brand-gray-600 capitalize">{field.name}:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-black">{field.value?.toString()}</span>
                </div>
              </div>
            ))}
            {/* Fill empty slot if less than 2 fields */}
            {displayFields.length < 2 && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-brand-gray-600">Info:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-black">N/A</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

            {/* Expanded section - showing remaining additional fields */}
            {isExpanded && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-x-4 relative pt-4">
                  {/* Vertical divider */}
                  <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 transform bg-brand-gray-100"></div>

                  {/* Remaining additional fields - Column 1 (first half of remaining fields) */}
                  <div className="space-y-3 pr-2">
                    {displayFields.slice(2, 2 + Math.ceil((displayFields.length - 2) / 2)).map((field, index) => (
                      <div key={field.name + index} className="flex items-center justify-between">
                        <span className="text-xs text-brand-gray-600 capitalize">{field.name}:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-black">{field.value?.toString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Remaining additional fields - Column 2 (second half of remaining fields) */}
                  <div className="space-y-3 pl-2">
                    {displayFields.slice(2 + Math.ceil((displayFields.length - 2) / 2)).map((field, index) => (
                      <div key={field.name + index} className="flex items-center justify-between">
                        <span className="text-xs text-brand-gray-600 capitalize">{field.name}:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-black">{field.value?.toString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
                {/* Expand/Collapse caret at the bottom */}
      <div className="px-4 py-3 flex justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-blue-600 hover:text-brand-gray-700 border-1 p-0.5 border-brand-gray-200 rounded-full"
        >
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
