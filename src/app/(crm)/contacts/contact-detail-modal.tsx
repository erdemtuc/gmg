"use client";

import { Modal } from "@/components/ui/modal";
import { useUIStore } from "@/stores/ui";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClientGet } from "@/infra/http/client";
import { ContactDetail } from "@/features/shared/models/contact-crud-models";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import EditIcon from "@/components/ui/edit-icon";
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
  AlignLeft,
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

// --- Helper Component: FieldValue ---
function FieldValue({ value, isMulti }: { value: any; isMulti?: boolean }) {
  if (value === null || value === undefined) {
    return <span className="text-gray-400 italic">—</span>;
  }

  // Handle arrays with multi-value fields
  if (Array.isArray(value) && isMulti) {
    if (value.length === 0) {
      return <span className="text-gray-400 italic">—</span>;
    }
    return (
      <div className="flex flex-col gap-1 text-right">
        {value.map((item, idx) => (
          <div key={idx} className="flex items-center justify-end gap-2">
            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-400">
              {idx + 1}
            </span>
            <span className="text-sm text-gray-900">{formatValue(item)}</span>
          </div>
        ))}
      </div>
    );
  }

  // Handle regular arrays (comma-separated)
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-gray-400 italic">—</span>;
    }
    return <span>{formatValue(value)}</span>;
  }

  return <span>{formatValue(value)}</span>;
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
    if (value.some((item) => typeof item === "object" && item.number)) {
      return value.map((item) => item.number).join(", ");
    }
    // If array contains simple values
    return value.join(", ");
  }

  // Handle object with 'option' property (like dropdowns)
  if (typeof value === "object" && value.option) {
    return value.option;
  }

  // Handle object with 'name' property (like UserAdded)
  if (typeof value === "object" && value.name) {
    return value.name;
  }

  // Handle object with 'id' and 'option' properties
  if (
    typeof value === "object" &&
    value.id !== undefined &&
    value.option !== undefined
  ) {
    return value.option;
  }

  // Handle any other object by returning a string representation of its values
  if (typeof value === "object") {
    const values = Object.values(value);
    return values.join(", ");
  }

  // For everything else, convert to string
  return String(value);
}

// --- Local Component: TasksTabContent ---

function TasksTabContent({ contactId }: { contactId?: string | null }) {
  const [displayOption, setDisplayOption] = useState<
    "all" | "active" | "completed"
  >("all");
  const [sortOption, setSortOption] = useState<
    "default" | "newest" | "oldest" | "dueDate"
  >("default");

  const {
    data: tasks,
    status,
    error,
  } = useQuery({
    queryKey: ["contact-tasks", contactId],
    enabled: !!contactId,
    queryFn: async () => {
      // Use native fetch to bypass the "Client can only call /api/* routes" restriction
      // in apiClientGet when calling an external URL.
      const response = await fetch(
        `https://api.mybasiccrm.com/api/resource.php?resource_type=task&contact_id=${contactId}`,
      );

      if (!response.ok) {
        throw new Error(
          `External API Error: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      // Check if the response indicates no resources
      if (
        data?.result === "error" &&
        (data?.error === "no_resource" || data?.code === "3")
      ) {
        throw new Error(JSON.stringify(data));
      }

      return data as ContactTask[];
    },
  });

  if (!contactId) return null;

  if (status === "pending") {
    return (
      <div className="flex animate-pulse flex-col gap-2">
        <div className="h-24 rounded-lg border border-gray-200 bg-gray-100"></div>
        <div className="h-24 rounded-lg border border-gray-200 bg-gray-100"></div>
      </div>
    );
  }

  if (status === "error") {
    // Check if the error is a no_resource error by parsing the error message
    const errorMessage = (error as Error)?.message || "";
    try {
      const errorObj = JSON.parse(errorMessage);
      if (
        errorObj?.result === "error" &&
        (errorObj?.error === "no_resource" ||
          errorObj?.code === "3" ||
          errorObj?.error_description === "There is no such resource")
      ) {
        return (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/50 py-12 text-gray-400">
            <CheckSquare className="mb-2 size-10 opacity-10" />
            <p className="text-sm font-medium">No tasks for this contact</p>
            <p className="text-xs">
              There are currently no tasks associated with this contact.
            </p>
          </div>
        );
      }
    } catch (e) {
      // If parsing fails, continue with regular error handling
    }
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/50 py-12 text-gray-400">
        <CheckSquare className="mb-2 size-10 opacity-10" />
        <p className="text-sm font-medium">No tasks found</p>
        <p className="text-xs">
          There are no tasks associated with this contact.
        </p>
      </div>
    );
  }

  // Filter tasks based on display option
  let filteredTasks = [...tasks];
  if (displayOption === "active") {
    // Assuming active tasks are those without a completed status
    filteredTasks = tasks.filter(
      (task) =>
        !task.dueDate.includes("ago") ||
        task.note?.toLowerCase().includes("completed") === false,
    );
  } else if (displayOption === "completed") {
    // Assuming completed tasks are those marked as completed
    filteredTasks = tasks.filter(
      (task) =>
        task.dueDate.includes("ago") ||
        task.note?.toLowerCase().includes("completed"),
    );
  }

  // Sort tasks based on sort option
  filteredTasks.sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return b.id - a.id;
      case "oldest":
        return a.id - b.id;
      case "dueDate":
        // Sort by due date, handling different date formats
        return a.dueDate.localeCompare(b.dueDate);
      case "default":
      default:
        // Default sorting - could be by ID or as received
        return a.id - b.id;
    }
  });

  return (
    <div className="pb-4">
      {/* Controls for display and sorting */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Display:</span>
          <select
            value={displayOption}
            onChange={(e) =>
              setDisplayOption(e.target.value as "all" | "active" | "completed")
            }
            className="rounded border border-gray-200 bg-white px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Sort:</span>
          <select
            value={sortOption}
            onChange={(e) =>
              setSortOption(
                e.target.value as "default" | "newest" | "oldest" | "dueDate",
              )
            }
            className="rounded border border-gray-200 bg-white px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
          >
            <option value="default">Default</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="group relative flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
          >
            {/* Header: Title and ID */}
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-sm leading-tight font-semibold text-gray-900">
                {task.ttname}
              </h4>
              <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                #{task.id}
              </span>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Calendar className="size-3.5 text-gray-400" />
              <span
                className={
                  task.dueDate.includes("ago")
                    ? "font-medium text-orange-600"
                    : ""
                }
              >
                {task.dueDate}
              </span>
            </div>

            {/* Note */}
            {task.note && (
              <div className="mt-1 flex items-start gap-2 rounded-lg bg-gray-50 p-2.5 text-xs text-gray-600">
                <AlignLeft className="mt-0.5 size-3.5 shrink-0 text-gray-400" />
                <p className="line-clamp-3">{task.note}</p>
              </div>
            )}
          </div>
        ))}
      </div>
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
      if (
        layoutMenuRef.current &&
        !layoutMenuRef.current.contains(event.target as Node)
      ) {
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
    <Modal
      isOpen={!!isOpen}
      onClose={handleClose}
      width="min(1200px, 90vw)"
      hideCloseButton
    >
      <div className="flex h-full max-h-[calc(90vh-2rem)] flex-col">
        {/* Modal header with search and actions */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4">
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

            <button className="border-brand-gray-200 hover:border-brand-primary-400 inline-flex cursor-pointer items-center gap-2 rounded-sm border-1 bg-white px-3 py-1.5 transition-colors">
              <UserPlus className="size-4 text-blue-600" />
              <span className="text-brand-gray-600 text-sm font-medium">
                Add Person
              </span>
            </button>

            <div className="relative" ref={layoutMenuRef}>
              <button
                onClick={() => setIsLayoutMenuOpen(!isLayoutMenuOpen)}
                className={`border-brand-gray-200 hover:border-brand-primary-400 inline-flex cursor-pointer items-center gap-2 rounded-sm border-1 px-3 py-1.5 transition-colors ${isLayoutMenuOpen ? "border-blue-200 bg-blue-50" : "bg-white"}`}
              >
                <Settings className="size-4 text-blue-600" />
                <span className="text-brand-gray-600 text-sm font-medium">
                  Change layout
                </span>
              </button>

              {/* Layout Dropdown */}
              {isLayoutMenuOpen && (
                <div className="ring-opacity-5 absolute right-0 z-50 mt-2 w-72 rounded-md bg-white p-4 shadow-lg ring-1 ring-black">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Change layout
                  </h3>
                  <p className="mt-1 mb-4 text-xs text-gray-500">
                    You can customize the layout of the page, hide or show the
                    sections you need
                  </p>

                  <div className="space-y-3">
                    {/* Layout Options */}
                    <div className="space-y-2">
                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="radio"
                          name="layout"
                          checked={layout === "grid"}
                          onChange={() => setLayout("grid")}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <LayoutGrid className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">Grid</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="radio"
                          name="layout"
                          checked={layout === "column"}
                          onChange={() => setLayout("column")}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Columns className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">Column</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="radio"
                          name="layout"
                          checked={layout === "row"}
                          onChange={() => setLayout("row")}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Rows className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">Row</span>
                      </label>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Visibility Toggles */}
                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          setVisibleSections((s) => ({
                            ...s,
                            details: !s.details,
                          }))
                        }
                        className="flex w-full items-center gap-3 rounded px-1 py-1 text-left hover:bg-gray-50"
                      >
                        <Eye
                          className={`h-4 w-4 ${visibleSections.details ? "text-gray-700" : "text-gray-400"}`}
                        />
                        <span
                          className={`text-sm ${visibleSections.details ? "text-gray-900" : "text-gray-500"}`}
                        >
                          Details
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          setVisibleSections((s) => ({ ...s, tasks: !s.tasks }))
                        }
                        className="flex w-full items-center gap-3 rounded px-1 py-1 text-left hover:bg-gray-50"
                      >
                        <Eye
                          className={`h-4 w-4 ${visibleSections.tasks ? "text-gray-700" : "text-gray-400"}`}
                        />
                        <span
                          className={`text-sm ${visibleSections.tasks ? "text-gray-900" : "text-gray-500"}`}
                        >
                          Tasks
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          setVisibleSections((s) => ({ ...s, files: !s.files }))
                        }
                        className="flex w-full items-center gap-3 rounded px-1 py-1 text-left hover:bg-gray-50"
                      >
                        <Eye
                          className={`h-4 w-4 ${visibleSections.files ? "text-gray-700" : "text-gray-400"}`}
                        />
                        <span
                          className={`text-sm ${visibleSections.files ? "text-gray-900" : "text-gray-500"}`}
                        >
                          Files & Images
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="border-brand-gray-200 hover:border-brand-primary-400 inline-flex cursor-pointer items-center gap-2 rounded-sm border-1 bg-white px-3 py-1.5 transition-colors">
              <History className="size-4 text-blue-600" />
              <span className="text-brand-gray-600 text-sm font-medium">
                History
              </span>
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
          <div className="flex flex-1 flex-col overflow-y-auto border-r border-gray-200 px-6 py-4">
            {/* Contact Title - Full information */}
            <div className="mb-6">
              <h1 className="mb-2 text-2xl font-semibold text-gray-900">
                {detailQuery.data?.name || "Contact"}
              </h1>
              <div className="mb-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-sm text-gray-700">Active</span>
                </span>
              </div>
              <div className="mb-4 text-right text-xs text-gray-500">
                <div>
                  ID:{detailQuery.data?.id ?? ""} • Created{" "}
                  {detailQuery.data?.createdAt ?? ""} by{" "}
                  <span className="text-blue-600">
                    {detailQuery.data?.createdBy ?? ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-semibold text-gray-900">
                Notes
              </h3>
              <p className="text-sm leading-relaxed text-gray-700">
                Jeff Karsten, a representative of the Green Valley Farmers
                Cooperative, is located in Baxter Springs, Cherokee County. You
                can reach them at (620) 856-2365.
              </p>
            </div>

            {/* Details - Multi-column layout */}
            {visibleSections.details &&
              detailQuery.status === "success" &&
              detailQuery.data?.fieldGroups && (
                <div className="relative flex gap-x-8">
                  {/* Left Column */}
                  <div className="flex flex-1 flex-col">
                    {(detailQuery.data?.fieldGroups || [])
                      .slice(
                        0,
                        Math.ceil(
                          (detailQuery.data?.fieldGroups || []).length / 2,
                        ),
                      )
                      .map((group, idx) => (
                        <section
                          key={`${group.groupTitle}-${idx}`}
                          className="relative mb-8 flex flex-col"
                        >
                          <h3 className="mb-4 text-sm font-semibold text-gray-900">
                            {group.groupTitle}
                          </h3>
                          <div className="flex flex-col gap-3">
                            {(group.fields || [])
                              .filter((field) => {
                                // Filter out empty values
                                if (
                                  field.value === null ||
                                  field.value === undefined ||
                                  field.value === ""
                                ) {
                                  return false;
                                }
                                // Filter out empty arrays
                                if (
                                  Array.isArray(field.value) &&
                                  field.value.length === 0
                                ) {
                                  return false;
                                }
                                return true;
                              })
                              .map((field, fieldIdx) => (
                                <div
                                  key={fieldIdx}
                                  className="flex items-start justify-between gap-4"
                                >
                                  <span className="min-w-[40%] flex-shrink-0 text-sm text-gray-600">
                                    {field.name}
                                  </span>
                                  <span className="ml-auto flex-1 text-right text-sm break-words text-gray-900">
                                    <FieldValue
                                      value={field.value}
                                      isMulti={field.multi === 1}
                                    />
                                  </span>
                                </div>
                              ))}
                          </div>
                        </section>
                      ))}
                  </div>

                  {/* Vertical Separator */}
                  <div className="w-px bg-gray-200"></div>

                  {/* Right Column */}
                  <div className="flex flex-1 flex-col">
                    {(detailQuery.data?.fieldGroups || [])
                      .slice(
                        Math.ceil(
                          (detailQuery.data?.fieldGroups || []).length / 2,
                        ),
                      )
                      .map((group, idx) => (
                        <section
                          key={`${group.groupTitle}-${idx}`}
                          className="relative mb-8 flex flex-col"
                        >
                          <h3 className="mb-4 text-sm font-semibold text-gray-900">
                            {group.groupTitle}
                          </h3>
                          <div className="flex flex-col gap-3">
                            {(group.fields || [])
                              .filter((field) => {
                                // Filter out empty values
                                if (
                                  field.value === null ||
                                  field.value === undefined ||
                                  field.value === ""
                                ) {
                                  return false;
                                }
                                // Filter out empty arrays
                                if (
                                  Array.isArray(field.value) &&
                                  field.value.length === 0
                                ) {
                                  return false;
                                }
                                return true;
                              })
                              .map((field, fieldIdx) => (
                                <div
                                  key={fieldIdx}
                                  className="flex items-start justify-between gap-4"
                                >
                                  <span className="min-w-[40%] flex-shrink-0 text-sm text-gray-600">
                                    {field.name}
                                  </span>
                                  <span className="ml-auto flex-1 text-right text-sm break-words text-gray-900">
                                    <FieldValue
                                      value={field.value}
                                      isMulti={field.multi === 1}
                                    />
                                  </span>
                                </div>
                              ))}
                          </div>
                        </section>
                      ))}
                  </div>
                </div>
              )}

            {detailQuery.status === "pending" && (
              <div className="p-2 text-xs text-gray-400">Loading…</div>
            )}
            {detailQuery.status === "error" && (
              <div className="p-2 text-xs text-red-600">
                {(detailQuery.error as Error)?.message || "Failed to load"}
              </div>
            )}
          </div>

          {/* Right Column - Tasks & Activities */}
          <div className="flex w-1/3 flex-col border-l border-gray-200 bg-gray-50">
            {/* Tabs */}
            <div className="flex flex-shrink-0 border-b border-gray-200 px-4 py-0">
              {visibleSections.files && (
                <button
                  type="button"
                  onClick={() => setActiveTab("files")}
                  className={`px-2 pt-4 pb-3 text-sm font-medium transition-colors focus:outline-none ${
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
                  className={`px-2 pt-4 pb-3 text-sm font-medium transition-colors focus:outline-none ${
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
                <TasksTabContent contactId={idFromUrl} />
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
          className="text-brand-primary-500 size-4 flex-shrink-0"
          aria-hidden
        />
      ) : null}
      <span className="text-brand-gray-600 text-sm font-medium">{label}</span>
    </button>
  );
}
