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
import EditIcon from "@/assets/icons/edit-outlined-default-icon.svg";
import CopyIcon from "@/assets/icons/copy-outlined-default-icon.svg";
import AddActivityIcon from "@/assets/icons/add-outlined-square-icon.svg";
import HistoryIcon from "@/assets/icons/history-outlined-default-icon.svg";
import EllipseIcon from "@/assets/icons/ellipse-filled-default-icon.svg";
import { distributeGroupsToColumns } from "@/features/shared/lib/distribute-groups-to-columns";
import { useState, useRef, useEffect as useReactEffect } from "react";
import { FilesTabContent } from "./files-tab-content";
import { TasksTabContent } from "./tasks-tab-content";
import { 
  UserPlus, 
  Settings, 
  X, 
  LayoutGrid, 
  Columns, 
  Rows, 
  Eye,
  History
} from "lucide-react";

type Tab = "details" | "files" | "tasks";
type LayoutType = "grid" | "column" | "row";

interface SectionVisibility {
  details: boolean;
  tasks: boolean;
  files: boolean;
}

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
  const [activeTab, setActiveTab] = useState<Tab>("details");
  
  // Layout Menu State
  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);
  const [layout, setLayout] = useState<LayoutType>("grid");
  const [visibleSections, setVisibleSections] = useState<SectionVisibility>({
    details: true,
    tasks: true,
    files: true,
  });
  const layoutMenuRef = useRef<HTMLDivElement>(null);

  // Close layout menu when clicking outside
  useReactEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (layoutMenuRef.current && !layoutMenuRef.current.contains(event.target as Node)) {
        setIsLayoutMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const detailColumnsCount = layout === "grid" ? 3 : layout === "row" ? 2 : 1;
  const detailColumns: FieldGroup[][] =
    detailQuery.status !== "success"
      ? []
      : distributeGroupsToColumns(
          detailQuery.data.fieldGroups,
          detailColumnsCount,
        );

  return (
    <Modal isOpen={!!isOpen} onClose={handleClose} width="65.5rem" hideCloseButton>
      <div className="flex flex-col max-h-[calc(85vh-2rem)]">
        {/* Modal header with search and actions */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 flex-shrink-0">
          {/* Search Bar */}
          <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white bg-gradient-to-r from-sky-100/0 to-sky-100 pl-2 ring-2 ring-blue-200">
            <Search className="size-4 text-zinc-400" aria-hidden />
            <input
              type="text"
              className="text-height-1 h-full w-80 py-2 pr-1.5 pl-2 text-xs leading-0 font-normal text-gray-600 outline-none placeholder:text-gray-300"
              placeholder="Search for anything..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ActionButton label="Edit" Icon={EditIcon} onClick={handleEdit} />
            
            <button className="border-brand-gray-200 hover:border-brand-primary-400 inline-flex cursor-pointer items-center gap-2 rounded-sm border-1 px-3 py-1.5 transition-colors bg-white">
              <UserPlus className="size-4 text-blue-600" />
              <span className="text-brand-gray-600 text-sm font-medium">Add Person</span>
            </button>

            <div className="relative" ref={layoutMenuRef}>
              <button 
                onClick={() => setIsLayoutMenuOpen(!isLayoutMenuOpen)}
                className={`border-brand-gray-200 hover:border-brand-primary-400 inline-flex cursor-pointer items-center gap-2 rounded-sm border-1 px-3 py-1.5 transition-colors ${isLayoutMenuOpen ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
              >
                <Settings className="size-4 text-blue-600" />
                <span className="text-brand-gray-600 text-sm font-medium">Change layout</span>
              </button>

              {/* Layout Dropdown */}
              {isLayoutMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-72 rounded-md bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5">
                  <h3 className="text-sm font-semibold text-gray-900">Change layout</h3>
                  <p className="mt-1 text-xs text-gray-500 mb-4">
                    You can customize the layout of the page, hide or show the sections you need
                  </p>

                  <div className="space-y-3">
                    {/* Layout Options */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="radio" 
                          name="layout" 
                          checked={layout === "grid"} 
                          onChange={() => setLayout("grid")}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <LayoutGrid className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">Grid</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="radio" 
                          name="layout" 
                          checked={layout === "column"} 
                          onChange={() => setLayout("column")}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <Columns className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">Column</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="radio" 
                          name="layout" 
                          checked={layout === "row"} 
                          onChange={() => setLayout("row")}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <Rows className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">Row</span>
                      </label>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Visibility Toggles */}
                    <div className="space-y-2">
                      <button 
                        onClick={() => setVisibleSections(s => ({ ...s, details: !s.details }))}
                        className="flex w-full items-center gap-3 text-left hover:bg-gray-50 rounded px-1 py-1"
                      >
                        <Eye className={`h-4 w-4 ${visibleSections.details ? 'text-gray-700' : 'text-gray-400'}`} />
                        <span className={`text-sm ${visibleSections.details ? 'text-gray-900' : 'text-gray-500'}`}>Details</span>
                      </button>
                      <button 
                        onClick={() => setVisibleSections(s => ({ ...s, tasks: !s.tasks }))}
                        className="flex w-full items-center gap-3 text-left hover:bg-gray-50 rounded px-1 py-1"
                      >
                        <Eye className={`h-4 w-4 ${visibleSections.tasks ? 'text-gray-700' : 'text-gray-400'}`} />
                        <span className={`text-sm ${visibleSections.tasks ? 'text-gray-900' : 'text-gray-500'}`}>Tasks</span>
                      </button>
                      <button 
                        onClick={() => setVisibleSections(s => ({ ...s, files: !s.files }))}
                        className="flex w-full items-center gap-3 text-left hover:bg-gray-50 rounded px-1 py-1"
                      >
                        <Eye className={`h-4 w-4 ${visibleSections.files ? 'text-gray-700' : 'text-gray-400'}`} />
                        <span className={`text-sm ${visibleSections.files ? 'text-gray-900' : 'text-gray-500'}`}>Files & Images</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="border-brand-gray-200 hover:border-brand-primary-400 inline-flex cursor-pointer items-center gap-2 rounded-sm border-1 px-3 py-1.5 transition-colors bg-white">
              <History className="size-4 text-blue-600" />
              <span className="text-brand-gray-600 text-sm font-medium">History</span>
            </button>

            <button 
              onClick={handleClose}
              className="ml-2 p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Contact header and sub collections */}
        <div className="border-brand-gray-100 flex border-y-1 flex-shrink-0">
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
                  <span className="text-brand-primary-600 text-xs">
                    {detailQuery.data?.createdBy ?? ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1">
              <h2 className="text-brand-gray-600 text-sm font-medium">Notes</h2>
              <p className="text-brand-gray-500 text-xs">
                Jeff Karsten, a representative of the Green Valley Farmers Cooperative, is located in Baxter Springs, Cherokee County. You can reach them at (620) 856-2365.
              </p>
            </div>
          </div>

          {/* Contact sub collections */}
          <div className="bg-brand-gray-50 basis-1/3 p-4">
            <div className="flex items-center gap-6 border-b border-gray-200">
              {visibleSections.files && (
                <button 
                  onClick={() => setActiveTab(activeTab === "files" ? "details" : "files")}
                  className={`pb-3 text-sm font-medium transition-colors focus:outline-none ${
                    activeTab === "files" 
                      ? "border-b-2 border-blue-600 text-gray-900" 
                      : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                  }`}
                >
                  Files & Images
                </button>
              )}
              {visibleSections.tasks && (
                <button 
                  onClick={() => setActiveTab(activeTab === "tasks" ? "details" : "tasks")}
                  className={`pb-3 text-sm font-medium transition-colors focus:outline-none ${
                    activeTab === "tasks" 
                      ? "border-b-2 border-blue-600 text-gray-900" 
                      : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                  }`}
                >
                  Task & Activities
                </button>
              )}
            </div>
            
            {visibleSections.files && activeTab === "files" && (
              <div className="mt-4">
                <FilesTabContent />
              </div>
            )}

            {visibleSections.tasks && activeTab === "tasks" && (
              <div className="mt-4 max-h-[300px] overflow-y-auto pr-1">
                <TasksTabContent />
              </div>
            )}
          </div>
        </div>

        {/* Grouped details */}
        {visibleSections.details && (
          <div
            className={`details divide-brand-gray-200 grid ${
              detailColumnsCount === 3 ? "grid-cols-3" : detailColumnsCount === 2 ? "grid-cols-2" : "grid-cols-1"
            } scroll-thin scrollbar-on-white scrollbar-gutter:stable min-h-0 flex-1 gap-y-3 divide-x overflow-x-hidden overflow-y-auto pe-0 pt-4 pb-8`}
          >
            {detailQuery.status === "pending" && (
              <div
                className={`text-brand-gray-400 ${
                  detailColumnsCount === 3 ? "col-span-3" : detailColumnsCount === 2 ? "col-span-2" : "col-span-1"
                } p-2 text-xs`}
              >
                Loading…
              </div>
            )}
            {detailQuery.status === "error" && (
              <div
                className={`${
                  detailColumnsCount === 3 ? "col-span-3" : detailColumnsCount === 2 ? "col-span-2" : "col-span-1"
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
        )}
      </div>
    </Modal>
  );
}

function ActionButton({
  label,
  Icon,
  onClick,
}: {
  label: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>; // SVG component
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="border-brand-gray-200 hover:border-brand-primary-400 inline-flex cursor-pointer items-center gap-2 rounded-sm border-1 px-2 py-1.5 transition-colors"
    >
      {Icon ? (
        <Icon 
          className="size-4 flex-shrink-0 text-brand-primary-500" 
          aria-hidden 
        />
      ) : null}
      <span className="text-brand-gray-600 text-sm font-medium">{label}</span>
    </button>
  );
}
