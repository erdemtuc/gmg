"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { useUIStore } from "@/stores/ui";
import { apiClientGet } from "@/infra/http/client";
import type { ActivityDetail } from "@/features/shared/models/activity-crud-models";
import { distributeGroupsToColumns } from "@/features/shared/lib/distribute-groups-to-columns";
import { formatFieldLabel } from "@/utils/format-label";
import {
  Search,
  UserPlus,
  Settings,
  X,
  LayoutGrid,
  Columns,
  Rows,
  Eye,
  History,
  Edit3 as EditIcon
} from "lucide-react";
import Image from "next/image";
import { FilesTabContent } from "../contacts/files-tab-content";
import { TasksTabContent } from "../contacts/tasks-tab-content";

type Tab = "details" | "files" | "tasks";
type Layout = "grid" | "column" | "row";
type VisibleSections = {
  details: boolean;
  tasks: boolean;
  files: boolean;
};


export function ActivityDetailModal() {
  const active = useUIStore((s) => s.modalState.active);
  const closeStore = useUIStore((s) => s.modalState.closeModal);
  const openActivityEdit = useUIStore((s) => s.modalState.openActivityEdit);

  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen =
    active?.type === "activityDetail" ? active.activityId : null;

  const activityIdFromUrl = params.get("activity_detail_id");
  const activityIdFromUrlValidated = activityIdFromUrl
    ? Number(activityIdFromUrl)
    : null;

  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [layout, setLayout] = useState<Layout>("grid");
  const [visibleSections, setVisibleSections] = useState<VisibleSections>({
    details: true,
    tasks: true,
    files: true,
  });
  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);
  const layoutMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        layoutMenuRef.current &&
        !layoutMenuRef.current.contains(event.target as Node)
      ) {
        setIsLayoutMenuOpen(false);
      }
    };

    if (isLayoutMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLayoutMenuOpen]);

  const handleClose = () => {
    const sp = new URLSearchParams(Array.from(params.entries()));
    sp.delete("activity_detail_id");
    router.replace(sp.size ? `${pathname}?${sp.toString()}` : pathname, {
      scroll: false,
    });
    closeStore();
  };

  const handleEdit = () => {
    if (!isOpen) return;
    const sp = new URLSearchParams(Array.from(params.entries()));
    sp.delete("activity_detail_id");
    sp.set("activity_edit_id", String(isOpen));
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    openActivityEdit(isOpen);
  };

  const detailQuery = useQuery({
    queryKey: ["activityDetail", isOpen],
    enabled: !!isOpen,
    queryFn: () => apiClientGet<ActivityDetail>(`/api/activities/${isOpen}`),
  });

  const detailColumnsCount: number =
    layout === "grid" ? 3 : layout === "row" ? 2 : 1;

  const detailColumns =
    detailQuery.status !== "success"
      ? []
      : distributeGroupsToColumns(
          detailQuery.data.fieldGroups,
          detailColumnsCount
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
            <button
              onClick={handleEdit}
              className="border-brand-gray-200 hover:border-brand-primary-400 inline-flex cursor-pointer items-center gap-2 rounded-sm border-1 px-3 py-1.5 transition-colors bg-white"
            >
              <EditIcon className="size-4 text-blue-600" />
              <span className="text-brand-gray-600 text-sm font-medium">Edit</span>
            </button>
            
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

        {/* Activity header and sub collections */}
        <div className="flex flex-1 min-h-0">
          {/* Activity header information - Left Column */}
          {visibleSections.details && (
            <div className="flex flex-1 flex-col gap-6 p-4 overflow-y-auto border-r border-gray-200">
              {detailQuery.status === "pending" && (
                <div className="text-brand-gray-400 text-xs">Loading…</div>
              )}
              {detailQuery.status === "error" && (
                <div className="text-xs text-red-600">
                  {(detailQuery.error as Error)?.message || "Failed to load"}
                </div>
              )}
              {detailQuery.status === "success" && (
                <>
                  {/* Main header fields */}
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-brand-gray-900 text-xl font-semibold">
                          {detailQuery.data.name}
                        </h2>
                      </div>
                    </div>

                    {/* Important top-level fields */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className="text-brand-gray-400 text-xs">Status</span>
                        <span className="text-brand-gray-600">{detailQuery.data.status}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-brand-gray-400 text-xs">Created By</span>
                        <span className="text-brand-gray-600">{detailQuery.data.createdBy}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-brand-gray-400 text-xs">Created At</span>
                        <span className="text-brand-gray-600">{detailQuery.data.createdAt}</span>
                      </div>
                    </div>

                    {/* Grouped details - Single column layout */}
                    <div className="details flex flex-col gap-3">
                      {detailQuery.status === "success" && detailQuery.data.fieldGroups && (
                        detailQuery.data.fieldGroups.map((group, idx) => (
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
                                    {field.label || formatFieldLabel(field.name)}
                                  </span>
                                  <span className="text-brand-gray-600">
                                    {String(field.value ?? "—")}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </section>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Right Side - Two Columns for Tabs */}
          <div className="flex flex-1">
            {/* Files & Images Column */}
            {visibleSections.files && (
              <div className="flex flex-1 flex-col bg-gray-50 border-r border-gray-200">
                <div className="flex items-center gap-6 border-b border-gray-200 p-4 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab("files")}
                    className={`pb-3 text-sm font-medium transition-colors focus:outline-none ${
                      activeTab === "files"
                        ? "border-b-2 border-blue-600 text-gray-900 font-bold"
                        : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                    }`}
                  >
                    Files & Images
                  </button>
                </div>
                {visibleSections.files && activeTab === "files" && (
                  <div className="flex-1 p-4 overflow-y-auto">
                    <FilesTabContent />
                  </div>
                )}
              </div>
            )}

            {/* Tasks & Activities Column */}
            {visibleSections.tasks && (
              <div className="flex flex-1 flex-col bg-gray-50">
                <div className="flex items-center gap-6 border-b border-gray-200 p-4 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab("tasks")}
                    className={`pb-3 text-sm font-medium transition-colors focus:outline-none ${
                      activeTab === "tasks"
                        ? "border-b-2 border-blue-600 text-gray-900 font-bold"
                        : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                    }`}
                  >
                    Task & Activities
                  </button>
                </div>
                {visibleSections.tasks && activeTab === "tasks" && (
                  <div className="flex-1 p-4 overflow-y-auto">
                    <TasksTabContent />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
