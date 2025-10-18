"use client";

import { Modal } from "@/components/ui/modal";
import { useUIStore } from "@/stores/ui";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClientGet } from "@/infra/http/client";
import {
  ContactDetail,
  FieldGroup,
} from "@/features/shared/models/contact-crud-models";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { ReactComponent as EditIcon } from "@/icons/edit-outlined-default-icon.svg";
import { ReactComponent as CopyIcon } from "@/icons/copy-outlined-default-icon.svg";
import { ReactComponent as AddActivityIcon } from "@/icons/add-outlined-square-icon.svg";
import { ReactComponent as HistoryIcon } from "@/icons/history-outlined-default-icon.svg";
import { ReactComponent as EllipseIcon } from "@/icons/ellipse-filled-default-icon.svg";
import { distributeGroupsToColumns } from "@/features/shared/lib/distribute-groups-to-columns";

export function ContactDetailModal() {
  const active = useUIStore((s) => s.modalState.active);
  const closeStore = useUIStore((s) => s.modalState.closeModal);
  const openContact = useUIStore((s) => s.modalState.openContactDetail);
  const openContactEdit = useUIStore((s) => s.modalState.openContactEdit);

  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = active?.type === "contactDetail";
  const contactId = active?.type === "contactDetail" ? active.contactId : null;

  const idFromUrl = params.get("contact_id");

  useEffect(() => {
    if (idFromUrl && (!isOpen || contactId !== idFromUrl)) {
      openContact(idFromUrl);
    }
    if (!idFromUrl && isOpen) {
      // URL no longer has contact param; ensure modal closes
      closeStore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idFromUrl]);

  const handleClose = () => {
    const sp = new URLSearchParams(Array.from(params.entries()));
    sp.delete("contact_id");
    router.replace(sp.size ? `${pathname}?${sp.toString()}` : pathname, {
      scroll: false,
    });
    closeStore();
  };

  const handleEdit = () => {
    if (contactId) {
      // Close the detail modal first
      closeStore();
      // Then open the edit modal
      openContactEdit(contactId);
    }
  };

  const detailQuery = useQuery({
    queryKey: ["contact", idFromUrl],
    enabled: !!idFromUrl,
    queryFn: async () =>
      apiClientGet<ContactDetail>(`/api/contacts/${idFromUrl}`),
    // Make prefetch useful and avoid flicker while modal opens
    staleTime: 30_000,
    gcTime: 2 * 60_000,
  });

  const detailColumnsCount: number = 3;
  const detailColumns: FieldGroup[][] =
    detailQuery.status !== "success"
      ? []
      : distributeGroupsToColumns(
          detailQuery.data.fieldGroups,
          detailColumnsCount,
        );

  return (
    <Modal isOpen={!!isOpen} onClose={handleClose} width="65.5rem">
      <div className="flex flex-col">
        {/* Modal header with search and actions */}
        <div className="inline-flex items-center justify-between p-4">
          <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white bg-gradient-to-r from-sky-100/0 to-sky-100 pl-2 ring-2 ring-blue-200">
            <Search className="size-4 text-zinc-400" aria-hidden />
            <input
              id="search"
              type="text"
              placeholder="Search for anything..."
              className="text-height-1 h-full w-80 py-2 pr-1.5 pl-2 text-xs leading-0 font-normal text-gray-600 outline-none placeholder:text-gray-300"
            />
          </div>
          <div className="inline-flex items-center gap-3 pr-8">
            <ActionButton label="Edit" Icon={EditIcon} onClick={handleEdit} />
            <ActionButton label="Copy" Icon={CopyIcon} />
            <ActionButton label="Add Activity / Task" Icon={AddActivityIcon} />
            <ActionButton label="History" Icon={HistoryIcon} />
          </div>
        </div>

        {/* Contact header and sub collections */}
        <div className="border-brand-gray-100 flex border-y-1">
          {/* Contact header information */}
          <div className="flex basis-2/3 flex-col p-4">
            <h1 className="text-brand-gray-600 text-lg leading-6 font-medium">
              {detailQuery.data?.name || "Contact"}
            </h1>
            <div className="flex flex-row items-center justify-between">
              <span className="text-brand-gray-600 text-xs">Active</span>
              <div className="flex flex-row items-center gap-2">
                <span className="text-brand-gray-400 text-xs">
                  ID:{detailQuery.data?.id ?? ""}
                </span>
                <EllipseIcon
                  className="text-brand-gray-400 size-1.5"
                  aria-hidden
                />
                <div>
                  <span className="text-brand-gray-400 text-xs">
                    Created {detailQuery.data?.createdAt ?? ""} by
                  </span>{" "}
                  <span className="text-brand-primary-500 text-xs">
                    {detailQuery.data?.createdBy ?? ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-brand-gray-600 mt-2 flex flex-col">
              <h2 className="text-sm font-medium">Notes</h2>
              <p className="self-stretch text-xs">
                Jeff Karsten, a representative of the Green Valley Farmers
                Cooperative, is located in Baxter Springs, Cherokee County. You
                can reach them at (620) 856-2365.
              </p>
            </div>
          </div>

          {/* Contact sub collections */}
          <div className="bg-brand-gray-50 basis-1/3 p-4">
            <div className="flex items-center gap-4 border-b border-gray-200">
              <button className="text-brand-gray-600 hover:border-brand-primary-500 cursor-pointer border-b-2 border-b-transparent text-sm transition-colors focus:outline-none">
                Files & Images
              </button>
              <button className="text-brand-gray-600 hover:border-brand-primary-500 cursor-pointer border-b-2 border-b-transparent text-sm transition-colors focus:outline-none">
                Task & Activities
              </button>
            </div>
          </div>
        </div>

        {/* Grouped details */}
        <div
          className={`details divide-brand-gray-200 grid ${
            detailColumnsCount === 2 ? "grid-cols-2" : "grid-cols-3"
          } scroll-thin scrollbar-on-white scrollbar-gutter:stable max-h-122 min-h-0 gap-y-3 divide-x overflow-x-hidden overflow-y-auto pe-0 pt-4 pb-8`}
        >
          {detailQuery.status === "pending" && (
            <div
              className={`text-brand-gray-400 ${
                detailColumnsCount === 2 ? "col-span-2" : "col-span-3"
              } p-2 text-xs`}
            >
              Loading…
            </div>
          )}
          {detailQuery.status === "error" && (
            <div
              className={`${
                detailColumnsCount === 2 ? "col-span-2" : "col-span-3"
              } p-2 text-xs text-red-600`}
            >
              {(detailQuery.error as Error)?.message || "Failed to load"}
            </div>
          )}
          {detailQuery.status === "success" &&
            Array.from({ length: detailColumnsCount }).map((_, colIdx) => (
              <div key={`col-${colIdx}`} className="flex flex-col gap-3 px-4">
                {(detailColumns[colIdx] ?? []).map((group, idx) => (
                  <section
                    key={`${group.groupTitle}-${idx}`}
                    className="flex flex-col gap-3"
                  >
                    <h3 className="text-brand-gray-600 text-sm font-medium">
                      {group.groupTitle}
                    </h3>
                    <ul className="flex flex-col gap-3">
                      {group.fields.map((field, idx) => (
                        <li
                          key={idx}
                          className="flex flex-row justify-between text-xs"
                        >
                          <span className="text-brand-gray-400">
                            {field.name}
                          </span>
                          <span className="text-brand-gray-500">
                            {String(field.value ?? "")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
}

type IconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

function ActionButton({
  label,
  Icon,
  onClick,
}: {
  label: string;
  Icon?: IconComponent;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="border-brand-gray-200 hover:border-brand-primary-400 inline-flex cursor-pointer items-center gap-2 rounded-sm border-1 px-2 py-1.5"
    >
      {Icon ? (
        <Icon className="text-brand-primary-500 size-4" aria-hidden />
      ) : null}
      <span className="text-brand-gray-600 text-sm font-medium">{label}</span>
    </button>
  );
}
