"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { useUIStore } from "@/stores/ui";
import { apiClientGet } from "@/infra/http/client";
import type {
  ContactAddForm,
  ContactType,
} from "@/features/shared/models/contact-crud-models";
import { createContactAction } from "@/features/contact/actions";
import { distributeGroupsToColumns } from "@/features/shared/lib/distribute-groups-to-columns";
import { FieldResolver } from "@/components/ui/inputs";
import { FormTypeWatcher } from "@/components/providers";
import {
  EditFieldGroup,
  FormValues,
} from "@/features/shared/models/crud-models";
import { useFieldVisibility } from "@/utils/use-field-visibility";
import { FilesTabContent } from "./files-tab-content";
import { TasksTabContent } from "./tasks-tab-content";
import { Search, UserPlus, Settings, X, History, LayoutGrid, Columns, Rows, Eye } from "lucide-react";

type Tab = "details" | "files" | "tasks";
type LayoutType = "grid" | "column" | "row";

interface SectionVisibility {
  details: boolean;
  tasks: boolean;
  files: boolean;
}

export function ContactAddModal() {
  const active = useUIStore((s) => s.modalState.active);
  const closeStore = useUIStore((s) => s.modalState.closeModal);
  const openContactAdd = useUIStore((s) => s.modalState.openContactAdd);

  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = active?.type === "contactAdd";
  const activeType: ContactType | null =
    active?.type === "contactAdd" ? active.contactType : null;

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

  const typeFromUrl = params.get("contact_add_type");
  const typeFromUrlValidated =
    typeFromUrl === "O" || typeFromUrl === "P"
      ? (typeFromUrl as ContactType)
      : null;

  // Close layout menu when clicking outside
  useEffect(() => {
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
    if (
      typeFromUrlValidated &&
      (!isOpen || activeType !== typeFromUrlValidated)
    ) {
      openContactAdd(typeFromUrlValidated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFromUrlValidated]);

  const handleClose = () => {
    const sp = new URLSearchParams(Array.from(params.entries()));
    sp.delete("contact_add_type");
    router.replace(sp.size ? `${pathname}?${sp.toString()}` : pathname, {
      scroll: false,
    });
    closeStore();
  };

  const formQuery = useQuery({
    queryKey: ["contactAddForm", activeType],
    enabled: !!isOpen,
    queryFn: async () =>
      apiClientGet<ContactAddForm>(`/api/contacts/add-form`, {
        query: { type: activeType ?? null },
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes - use gcTime instead of cacheTime
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once on failure
    retryDelay: 3000, // Wait 3 seconds before retry
  });

  // Handle field visibility based on render function
  const { visibleFields, updateFieldValues } = useFieldVisibility({
    formRenderFunction: formQuery.data?.renderfnc,
    mainFields: formQuery.data?.mainFields || [],
    fieldGroups: formQuery.data?.fieldGroups || [],
  });

  // When tasks tab is active, always use 2 columns for details to make space for expanded tasks
  const detailColumnsCount = activeTab === "tasks" ? 2 : 3;
  const detailColumns: EditFieldGroup[][] =
    formQuery.status !== "success"
      ? []
      : distributeGroupsToColumns(
          visibleFields.fieldGroups,
          detailColumnsCount,
        );

  const form = useForm<FormValues>({});

  // Watch for changes in form values to update field visibility
  const watchedValues = form.watch();

  // Reset form when data is loaded
  useEffect(() => {
    if (formQuery.data && formQuery.data.mainFields && formQuery.data.fieldGroups) {
      const formValues: FormValues = {};

      // --- FIX START: Sanitize Values ---
      // This ensures that Objects (like {id: 'P', value: 'Person'}) returned by API
      // are converted to Primitives ('P') so the visibility logic works.
      const sanitizeValue = (val: any, fieldType: string) => {
        if (val === null || val === undefined) return "";

        // 1. Handle Arrays
        if (Array.isArray(val)) {
          if (val.length === 0) return "";

          const firstItem = val[0];

          // Handle Phone Structure [{ number: "(532)...", type: "" }]
          if (firstItem && typeof firstItem === "object" && "number" in firstItem) {
             return val.map((item: any) => item.number).join(", ");
          }

          // Handle Email/Text Structure ["email@test.com"]
          if (typeof firstItem === "string" && (fieldType === "text" || fieldType === "textarea")) {
            return val.join(", ");
          }

          return val; // Return raw array for Multi-Select components
        }

        // 2. Handle Objects
        if (typeof val === "object" && !(val instanceof Date)) {
          // Handle Organization Structure { id: 21, option: "Kahveci" }
          if ("option" in val) return val.option;

          // Standard lookups
          if ("value" in val) return val.value;
          if ("id" in val) return val.id;
          if ("key" in val) return val.key;
        }

        return val;
      };
      // --- FIX END ---

      // Add main fields
      formQuery.data.mainFields.forEach((field) => {
        formValues[field.name] = sanitizeValue(field.value, field.type);
      });

      // Add grouped fields
      formQuery.data.fieldGroups.forEach((group) => {
        group.fields.forEach((field) => {
          formValues[field.name] = sanitizeValue(field.value, field.type);
        });
      });

      form.reset(formValues);
    }
  }, [formQuery.data, form]);

  // Update field visibility when form values change
  useEffect(() => {
    Object.entries(watchedValues).forEach(([fieldId, value]) => {
      updateFieldValues(fieldId, value);
    });
  }, [watchedValues, updateFieldValues]);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      const result = await createContactAction(values);
      if (!result?.ok) {
        setSubmitError(result?.error || "Failed to create contact");
        return;
      }
      handleClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unexpected error";
      setSubmitError(msg);
    }
  };

  return (
    <Modal
      isOpen={!!isOpen}
      onClose={handleClose}
      width="65.5rem"
      hideCloseButton
    >
      <div className="flex flex-col max-h-[calc(85vh-2rem)] h-full rounded-b-xl overflow-y-auto">
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
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
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
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
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

        <FormProvider {...form}>
          <FormTypeWatcher
            currentType={activeType}
            typeFieldName="type"
            paramName="contact_add_type"
          />
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 min-h-0 overflow-hidden"
          >
            {/* Scrollable content area - now handles overflow at the main container level */}
            <div className="flex-1 min-h-0 overflow-x-hidden">
              {/* Contact header and sub collections */}
              <div className="border-brand-gray-100 flex border-y-1 flex-shrink-0">
                {/* Contact header information */}
                <div className="flex basis-2/3 flex-col gap-6 p-4">
                  {formQuery.status === "pending" && (
                    <div className="text-brand-gray-400 col-span-2 text-xs">
                      Loading…
                    </div>
                  )}
                  {formQuery.status === "error" && (
                    <div className="col-span-2 text-xs text-red-600">
                      {(formQuery.error as Error)?.message || "Failed to load"}
                    </div>
                  )}
                  {formQuery.status === "success" && visibleFields.mainFields && visibleFields.mainFields.length > 0 ? (
                    visibleFields.mainFields.map((field) => (
                      <FieldResolver
                        key={String(field.id)}
                        field={field}
                        control={form.control}
                      />
                    ))
                  ) : formQuery.status === "pending" ? (
                    <div className="text-brand-gray-400 text-xs">
                      Loading…
                    </div>
                  ) : formQuery.status === "error" ? (
                    <div className="text-red-600 text-xs">
                      {(formQuery.error as Error)?.message || "Failed to load"}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">No main fields available</div>
                  )}
                </div>

                {/* Contact sub collections - conditional rendering */}
                <div className="bg-brand-gray-50 basis-1/3 p-4">
                  <div className="flex items-center gap-6 border-b border-gray-200 p-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === "files" ? "details" : "files")}
                      className={`pb-3 text-sm font-medium transition-colors focus:outline-none ${
                        activeTab === "files"
                          ? "border-b-2 border-blue-600 text-gray-900"
                          : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                      }`}
                    >
                      Files & Images
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === "tasks" ? "details" : "tasks")}
                      className={`pb-3 text-sm font-medium transition-colors focus:outline-none ${
                        activeTab === "tasks"
                          ? "border-b-2 border-blue-600 text-gray-900"
                          : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                      }`}
                    >
                      Task & Activities
                    </button>
                  </div>

                  <div className="p-4 flex-1">
                    {activeTab === "files" && (
                      <FilesTabContent />
                    )}
                  </div>
                </div>
              </div>

              {/* Main content area - adjust layout based on active tab */}
              {visibleSections.details && activeTab === "tasks" ? (
                // Special layout when tasks tab is active - 2 detail cols + tasks as 3rd col
                <div className="flex flex-1 min-h-0 max-h-full">
                  {/* 2 columns of detail fields */}
                  <div
                    className="details divide-brand-gray-200 grid grid-cols-2 w-2/3 scroll-thin scrollbar-on-white min-h-0 flex-1 gap-y-3 divide-x overflow-x-hidden overflow-y-auto pe-0 pt-0 pb-0"
                  >
                    {formQuery.status === "pending" && (
                      <div className="text-brand-gray-400 col-span-2 p-2 text-xs">
                        Loading…
                      </div>
                    )}
                    {formQuery.status === "error" && (
                      <div className="text-brand-gray-400 col-span-2 p-2 text-xs text-red-600">
                        {(formQuery.error as Error)?.message || "Failed to load"}
                      </div>
                    )}
                    {formQuery.status === "success" &&
                      Array.from({ length: 2 }).map((_, colIdx) => (
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
                                    <FieldResolver
                                      key={String(field.id)}
                                      field={field}
                                      control={form.control}
                                    />
                                  </li>
                                ))}
                              </ul>
                            </section>
                          ))}
                        </div>
                      ))}
                  </div>

                  {/* Tasks as third column */}
                  <div className="w-1/3 bg-brand-gray-50 border-l border-gray-200 flex flex-col min-h-0">
                    <div className="p-4 flex-1 max-h-full">
                      <TasksTabContent />
                    </div>
                  </div>
                </div>
              ) : visibleSections.details ? (
                // Default layout when tasks tab is not active
                <div className="flex-1 overflow-y-auto scroll-thin scrollbar-on-white">
                  {/* Grouped details */}
                  {formQuery.status === "success" && (
                    <div
                      className={`details divide-brand-gray-200 ${
                        detailColumnsCount === 3 ? "grid grid-cols-3 w-full" :
                        detailColumnsCount === 2 ? "grid grid-cols-2 w-full" : "grid grid-cols-1 w-full"
                      } scroll-thin scrollbar-on-white min-h-0 flex-1 gap-y-3 divide-x overflow-x-hidden overflow-y-auto pe-0 pt-0 pb-0 max-h-full`}
                    >
                      {Array.from({ length: detailColumnsCount }).map((_, colIdx) => (
                        <div
                          key={`col-${colIdx}`}
                          className="flex flex-col gap-3 px-4"
                        >
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
                                    <FieldResolver
                                      key={String(field.id)}
                                      field={field}
                                      control={form.control}
                                    />
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
              ) : null}
            </div>

            {/* Actions - Fixed at bottom */}
            <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-white rounded-b-xl">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-4">
                  <button
                    type="submit"
                    className="bg-brand-primary-500 hover:ring-brand-primary-100 active:bg-brand-primary-600 text-brand-white text-small h-10 w-24 cursor-pointer rounded-md px-2 py-2 text-sm font-medium hover:ring-4 active:ring-0"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="bg-brand-white hover:ring-brand-primary-500 active:ring-brand-primary-600 text-brand-primary-500 text-small h-10 w-24 cursor-pointer rounded-md px-2 py-2 text-sm font-medium hover:ring-2"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                </div>
                <button
                  type="button"
                  className="bg-brand-white hover:ring-brand-primary-500 active:ring-brand-primary-600 text-brand-primary-500 text-small h-10 min-w-24 cursor-pointer rounded-md px-2 py-2 text-sm font-medium hover:ring-2"
                  onClick={handleClose}
                >
                  Page Wizard
                </button>
              </div>
              {submitError ? (
                <div className="text-brand-error-500 text-xs mt-2">
                  {submitError}
                </div>
              ) : null}
            </div>
          </form>
        </FormProvider>
      </div>
    </Modal>
  );
}