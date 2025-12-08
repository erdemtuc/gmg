"use client";

import { Modal } from "@/components/ui/modal";
import { useUIStore } from "@/stores/ui";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClientGet } from "@/infra/http/client";
import {
  ContactDetail,
} from "@/features/shared/models/contact-crud-models";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import EditIcon from "@/assets/icons/edit-outlined-default-icon.svg";
import { useState, useRef, useEffect as useReactEffect } from "react";
import { FilesTabContent } from "./files-tab-content";
import {
  UserPlus,
  Settings,
  X,
  LayoutGrid,
  Columns,
  Rows,
  Eye,
  History,
  Calendar,
  CheckSquare,
  AlignLeft
} from "lucide-react";

// --- Types ---

interface TaskLine {
  [key: string]: any;
}

interface ContactTask {
  id: number;
  ttname: string;
  note: string;
  dueDate: string;
  lines: TaskLine[];
}

type Tab = "files" | "tasks";
type LayoutType = "grid" | "column" | "row";

interface SectionVisibility {
  details: boolean;
  tasks: boolean;
  files: boolean;
}

// --- Helper Functions ---

function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return "";
  }

  // Handle array of objects (like phone numbers)
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "";
    }
    // If array contains objects with 'number' property (like phones)
    if (value.some(item => typeof item === 'object' && item.number)) {
      return value.map(item => item.number).join(", ");
    }
    // If array contains simple values
    return value.join(", ");
  }

  // Handle object with 'option' property (like dropdowns)
  if (typeof value === 'object' && value.option) {
    return value.option;
  }

  // Handle object with 'name' property (like UserAdded)
  if (typeof value === 'object' && value.name) {
    return value.name;
  }

  // Handle object with 'id' and 'option' properties
  if (typeof value === 'object' && value.id !== undefined && value.option !== undefined) {
    return value.option;
  }

  // Handle any other object by returning a string representation of its values
  if (typeof value === 'object') {
    const values = Object.values(value);
    return values.join(", ");
  }

  // For everything else, convert to string
  return String(value);
}

// --- Local Component: TasksTabContent ---

function TasksTabContent({ contactId }: { contactId: string | null }) {
  const { data: tasks, status, error } = useQuery({
    queryKey: ["contact-tasks", contactId],
    enabled: !!contactId,
    queryFn: async () => {
      // Use native fetch to bypass the "Client can only call /api/* routes" restriction
      // in apiClientGet when calling an external URL.
      const response = await fetch(
        `https://api.mybasiccrm.com/api/resource.php?resource_type=task`
      );
      
      if (!response.ok) {
        throw new Error(`External API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data as ContactTask[];
    },
  });

  if (!contactId) return null;

  if (status === "pending") {
    return (
      <div className="flex flex-col gap-2 animate-pulse">
        <div className="h-24 bg-gray-100 rounded-lg border border-gray-200"></div>
        <div className="h-24 bg-gray-100 rounded-lg border border-gray-200"></div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
        <p className="font-medium">Failed to load tasks</p>
        <p className="text-xs mt-1 opacity-80">
          {(error as Error).message}
        </p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
        <CheckSquare className="size-10 mb-2 opacity-10" />
        <p className="text-sm font-medium">No tasks found</p>
        <p className="text-xs">There are no tasks associated with this contact.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="group relative flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
        >
          {/* Header: Title and ID */}
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-sm font-semibold text-gray-900 leading-tight">
              {task.ttname}
            </h4>
            <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              #{task.id}
            </span>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Calendar className="size-3.5 text-gray-400" />
            <span className={task.dueDate.includes("ago") ? "text-orange-600 font-medium" : ""}>
              {task.dueDate}
            </span>
          </div>

          {/* Note */}
          {task.note && (
            <div className="mt-1 flex items-start gap-2 rounded-lg bg-gray-50 p-2.5 text-xs text-gray-600">
              <AlignLeft className="size-3.5 mt-0.5 text-gray-400 shrink-0" />
              <p className="line-clamp-3">{task.note}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// --- Main Component ---

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
  const [activeTab, setActiveTab] = useState<Tab>("tasks");
  
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

  return (
    <Modal isOpen={!!isOpen} onClose={handleClose} width="65.5rem" hideCloseButton>
      <div className="flex flex-col max-h-[calc(85vh-2rem)] h-full">
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

        {/* Contact header and content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column - Main Content */}
          <div className="flex-1 overflow-y-auto p-6 border-r border-gray-200">
            {/* Contact Title - Full information */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {detailQuery.data?.name || "Contact"}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-gray-700">Active</span>
                </span>
              </div>
              <div className="text-right text-xs text-gray-500 mb-4">
                <div>
                  ID:{detailQuery.data?.id ?? ""} • Created {detailQuery.data?.createdAt ?? ""} by{" "}
                  <span className="text-blue-600">{detailQuery.data?.createdBy ?? ""}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Jeff Karsten, a representative of the Green Valley Farmers Cooperative, is located in Baxter Springs, Cherokee County. You can reach them at (620) 856-2365.
              </p>
            </div>

            {/* Details - Multi-column layout */}
            {visibleSections.details && detailQuery.status === "success" && detailQuery.data?.fieldGroups && (
              <div className={`grid ${
                layout === "grid" ? "grid-cols-2" :
                layout === "row" ? "grid-cols-2" : "grid-cols-1"
              } gap-x-8 gap-y-6`}>
                {(detailQuery.data?.fieldGroups || []).map((group, idx) => (
                  <section key={`${group.groupTitle}-${idx}`} className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">{group.groupTitle}</h3>
                    <div className="space-y-3">
                      {(group.fields || []).map((field, fieldIdx) => (
                        <div key={fieldIdx} className="flex justify-between">
                          <span className="text-sm text-gray-600">{field.name}</span>
                          <span className="text-sm text-gray-900">{formatValue(field.value)}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
            
            {detailQuery.status === "pending" && (
              <div className="text-gray-400 p-2 text-xs">Loading…</div>
            )}
            {detailQuery.status === "error" && (
              <div className="text-red-600 p-2 text-xs">
                {(detailQuery.error as Error)?.message || "Failed to load"}
              </div>
            )}
          </div>

          {/* Right Column - Tasks & Activities */}
          <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-4 py-0 flex-shrink-0">
              {visibleSections.files && (
                <button
                  type="button"
                  onClick={() => setActiveTab("files")}
                  className={`pb-3 pt-4 px-2 text-sm font-medium transition-colors focus:outline-none ${
                    activeTab === "files"
                      ? "border-b-2 border-blue-600 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Files & Images
                </button>
              )}
              {visibleSections.tasks && (
                <button
                  type="button"
                  onClick={() => setActiveTab("tasks")}
                  className={`pb-3 pt-4 px-2 text-sm font-medium transition-colors focus:outline-none ${
                    activeTab === "tasks"
                      ? "border-b-2 border-blue-600 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Task & Activities
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "files" && visibleSections.files && (
                <FilesTabContent />
              )}
              {activeTab === "tasks" && visibleSections.tasks && (
                <TasksTabContent contactId={contactId} />
              )}
            </div>
          </div>
        </div>
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