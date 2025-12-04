import { Contact } from "@/features/shared/models/contact-crud-models";
import { useUIStore } from "@/stores/ui";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { apiClientGet } from "@/infra/http/client";
import { ContactDetail } from "@/features/shared/models/contact-crud-models";
import { useRef } from "react";

export default function ContactCard({ contact }: { contact: Contact }) {
  const openContact = useUIStore((s) => s.modalState.openContactDetail);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const hoverPrefetchTimeoutRef = useRef<number | null>(null);

  const prefetchContactDetail = () => {
    const key = ["contact", String(contact.id)];
    const state = queryClient.getQueryState<ContactDetail>(key);
    const now = Date.now();
    // Skip if we already have fresh data within staleTime
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
    const sp = new URLSearchParams(Array.from(params.entries()));
    sp.set("contact_id", String(contact.id));
    router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    openContact(String(contact.id));
  };

  const additionalFields = contact.additionalFields || [];
  const mid = Math.ceil(additionalFields.length / 2);
  const left = additionalFields.slice(0, mid);
  const right = additionalFields.slice(mid);

  return (
    <div
      className="bg-brand-white ring-brand-gray-200 hover:ring-brand-primary-200 cursor-pointer rounded-xl p-4 ring-1 transition-colors duration-200 ease-in-out hover:ring-2"
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
      onClick={open}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          prefetchContactDetail();
          open();
        }
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-brand-gray-600 text-base leading-1.5 font-medium">
          {contact.name}
        </h2>
        <span className="text-brand-primary-500 text-xs font-medium">
          {contact.type}
        </span>
      </div>
      <hr className="border-brand-gray-200 my-2 border-0 border-t" />
      <div className="divide-brand-gray-200 grid grid-cols-2 divide-x">
        <div className="flex flex-col justify-between gap-2 pr-4">
          {left.map((it, idx) => (
            <div key={idx}>{renderAdditionalField(it.name, it.value)}</div>
          ))}
        </div>
        <div className="flex flex-col justify-between gap-2 pl-4">
          {right.map((it, idx) => (
            <div key={idx}>{renderAdditionalField(it.name, it.value)}</div>
          ))}
        </div>
      </div>
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
