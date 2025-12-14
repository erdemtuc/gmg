import { Contact } from "@/features/shared/models/contact-crud-models";
import { useUIStore } from "@/stores/ui";
import { usePathname, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { apiClientGet } from "@/infra/http/client";
import { ContactDetail } from "@/features/shared/models/contact-crud-models";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

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
      {/* Header Section */}
      <div className="bg-white p-4 pb-8">
        {" "}
        {/* Added pb-8 to make space for the absolute positioned button */}
        <div className="mb-3 flex items-start gap-3">
          {/* Avatar */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {getInitial(contact.name)}
          </div>

          {/* Main Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium text-black">
                  {contact.name}
                </h3>
              </div>
              <span className="flex-shrink-0 rounded bg-blue-50 px-2 py-1 text-xs font-semibold whitespace-nowrap text-blue-600">
                {contact.type || "Prospect"}
              </span>
            </div>
          </div>
        </div>
        {/* Dynamic Fields based on the API response */}
        <div className="relative">
          <div className="bg-brand-gray-200 absolute top-0 right-0 left-0 h-px"></div>{" "}
          {/* Continuous top border */}
          <div className="relative z-10 mb-3 grid grid-cols-2 gap-4 pt-3">
            {" "}
            {/* z-10 to be above the borders, pt-3 for space below the top border */}
            {contact.additionalFields && contact.additionalFields.length > 0 && (
              <>
                {/* Render the vertical border only when there are fields to show it between */}
                <div className="bg-brand-gray-200 absolute top-0 left-[50%] h-full w-px -translate-x-1/2 transform"></div>{" "}
                {/* Continuous vertical border */}
                {/* Determine how many fields to show based on expanded state */}
                {(() => {
                  const allFields = contact.additionalFields;
                  const maxVisibleFields = isExpanded ? allFields.length : 2; // Show 2 fields initially, all when expanded

                  // Left Column - First half of the visible fields
                  const leftFields = allFields
                    .slice(0, Math.ceil(allFields.length / 2))
                    .slice(0, Math.ceil(maxVisibleFields / 2));

                  // Right Column - Second half of the visible fields
                  const rightFields = allFields
                    .slice(Math.ceil(allFields.length / 2))
                    .slice(0, maxVisibleFields - leftFields.length);

                  return (
                    <>
                      {/* Left Column - First half of the fields */}
                      {leftFields.map((field, index) => (
                        <div
                          key={`left-${index}`}
                          className="flex justify-between"
                        >
                          <span className="text-xs text-black">{field.name}</span>
                          <span className="text-xs font-medium text-black">
                            {field.value}
                          </span>
                        </div>
                      ))}

                      {/* Right Column - Second half of the fields */}
                      {rightFields.map((field, index) => (
                        <div
                          key={`right-${index}`}
                          className="flex justify-between"
                        >
                          <span className="text-xs text-black">{field.name}</span>
                          <span className="text-xs font-medium text-black">
                            {field.value}
                          </span>
                        </div>
                      ))}
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      </div>

      {contact.additionalFields &&
        contact.additionalFields.length > 2 && (
          <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 transform">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="border-brand-gray-300 text-brand-gray-400 hover:text-brand-gray-600 flex h-6 w-6 items-center justify-center rounded-full border bg-white transition-colors"
            >
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        )}
      {(!contact.additionalFields ||
        contact.additionalFields.length <= 2) && (
        <div className="px-4 py-2">
          {/* Empty div when no expand button is shown */}
        </div>
      )}
    </div>
  );
}

function renderAdditionalField(
  label: string,
  value: string | number | boolean | undefined | null,
) {
  return (
    <div className="flex justify-between">
      <span className="text-brand-gray-400 text-xs font-normal">{label}:</span>
      <span className="text-brand-gray-600 text-xs font-normal">{value}</span>
    </div>
  );
}
