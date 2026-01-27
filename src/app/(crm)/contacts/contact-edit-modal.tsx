"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { useUIStore } from "@/stores/ui";
import { apiClientGet } from "@/infra/http/client";
import type {
  ContactEditForm,
} from "@/features/shared/models/contact-crud-models";
import { getContactTypeFromForm } from "@/features/shared/models/contact-crud-models";
import { updateContactAction } from "@/features/contact/actions";
import { distributeGroupsToColumns } from "@/features/shared/lib/distribute-groups-to-columns";
import { FieldResolver } from "@/components/ui/inputs";
import { FormTypeWatcher } from "@/components/providers";
import {
  EditFieldGroup,
  FormValues,
} from "@/features/shared/models/crud-models";
import { useFieldVisibility } from "@/utils/use-field-visibility";
import { FilesTabContent } from "./files-tab-content";
import { Search, UserPlus, Settings, X, History, LayoutGrid, Columns, Rows, Eye } from "lucide-react";

type Tab = "details" | "files";
type LayoutType = "grid" | "column" | "row";

interface SectionVisibility {
  details: boolean;
  files: boolean;
}

export function ContactEditModal() {
  const active = useUIStore((s) => s.modalState.active);
  const closeStore = useUIStore((s) => s.modalState.closeModal);
  const openContactEdit = useUIStore((s) => s.modalState.openContactEdit);

  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = active?.type === "contactEdit";
  const contactId = active?.type === "contactEdit" ? active.contactId : null;

  const [activeTab, setActiveTab] = useState<Tab>("details");

  // Layout Menu State
  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);
  const [layout, setLayout] = useState<LayoutType>("grid");
  const [visibleSections, setVisibleSections] = useState<SectionVisibility>({
    details: true,
    files: true,
  });
  const layoutMenuRef = useRef<HTMLDivElement>(null);

  const idFromUrl = params.get("contact_edit_id");

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
    if (idFromUrl && (!isOpen || contactId !== idFromUrl)) {
      openContactEdit(idFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idFromUrl]);

  const handleClose = () => {
    const sp = new URLSearchParams(Array.from(params.entries()));
    sp.delete("contact_edit_id");
    router.replace(sp.size ? `${pathname}?${sp.toString()}` : pathname, {
      scroll: false,
    });
    closeStore();
  };

  const formQuery = useQuery({
    queryKey: ["contactEditForm", contactId],
    enabled: !!isOpen && !!contactId,
    queryFn: async () =>
      apiClientGet<ContactEditForm>(`/api/contacts/edit-form`, {
        query: { id: contactId ?? null },
      }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
  });

  // Handle field visibility based on render function
  const { visibleFields, updateFieldValues } = useFieldVisibility({
    formRenderFunction: formQuery.data?.renderfnc,
    mainFields: formQuery.data?.mainFields || [],
    fieldGroups: formQuery.data?.fieldGroups || [],
  });

  const detailColumnsCount = 3;
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
    if (formQuery.data) {
      const formValues: FormValues = {};

      // Helper to sanitize values and prevent [object Object] in inputs
      // Now checks field type and specific object keys like 'number' and 'option'
      const sanitizeValue = (val: any, fieldType: string, fieldName: string) => {
        if (val === null || val === undefined) return "";

        // 1. Handle Arrays
        if (Array.isArray(val)) {
          // For multi-input fields (email, phone, or fields marked as isMulti), return the raw array
          const isEmailField = fieldName.toLowerCase().includes('email');
          const isPhoneField = fieldName.toLowerCase().includes('phone');

          if (isEmailField || isPhoneField) {
            return val; // Return raw array for MultiInput components
          }

          if (val.length === 0) return "";

          const firstItem = val[0];

          // FIX: Handle Phone Structure [{ number: "(532)...", type: "" }]
          if (firstItem && typeof firstItem === "object" && "number" in firstItem) {
             // Extract the numbers and join them with a comma (usually there's just one)
             return val.map((item: any) => item.number).join(", ");
          }

          // FIX: Handle Email/Text Structure ["email@test.com"]
          // If the input type is 'text' but value is array of strings, join them
          if (typeof firstItem === "string" && (fieldType === "text" || fieldType === "textarea")) {
            return val.join(", ");
          }

          return val; // Return raw array for Multi-Select components
        }

        // 2. Handle Objects
        if (typeof val === "object" && !(val instanceof Date)) {
          // FIX: Handle Organization Structure { id: 21, option: "Kahveci" }
          if ("option" in val) return val.option;

          // Standard lookups
          if ("value" in val) return val.value;
          if ("id" in val) return val.id;
          if ("key" in val) return val.key;
        }

        return val;
      };

      // Add main fields
      if (formQuery.data.mainFields) {
        formQuery.data.mainFields.forEach((field) => {
          formValues[field.name] = sanitizeValue(field.value, field.type, field.name);
        });
      }

      // Add grouped fields
      if (formQuery.data.fieldGroups) {
        formQuery.data.fieldGroups.forEach((group) => {
          group.fields.forEach((field) => {
            formValues[field.name] = sanitizeValue(field.value, field.type, field.name);
          });
        });
      }

      form.reset(formValues);
    }
  }, [formQuery.data]);

  // Update field visibility when form values change
  useEffect(() => {
    Object.entries(watchedValues).forEach(([fieldId, value]) => {
      updateFieldValues(fieldId, value);
    });
  }, [watchedValues, updateFieldValues]);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    if (!contactId) {
      setSubmitError("Contact ID is missing");
      return;
    }

    setSubmitError(null);
    try {
      const result = await updateContactAction(contactId, values);
      if (!result?.ok) {
        setSubmitError(result?.error || "Failed to update contact");
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
      <div className="flex flex-col h-full rounded-b-xl">
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
            currentType={
              formQuery.data ? getContactTypeFromForm(formQuery.data) : null
            }
            typeFieldName="type"
            paramName="contact_edit_type"
          />
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Content area - now allows natural expansion */}
            <div className="flex-1 min-h-0">
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
                  {formQuery.status === "success" &&
                    (visibleFields.mainFields ?? []).map((field) => (
                      <FieldResolver
                        key={String(field.id)}
                        field={field}
                        control={form.control}
                      />
                    ))}
                </div>

                {/* Contact sub collections - conditional rendering */}
                <div className="bg-brand-gray-50 basis-1/3 p-4">
                  <div className="flex items-center gap-6 border-b border-gray-200 p-4">
                    <button
                      type="button"
                      className="pb-3 text-sm font-medium transition-colors focus:outline-none border-b-2 border-blue-600 text-gray-900"
                    >
                      Files & Images
                    </button>
                  </div>

                  <div className="p-4 flex-1">
                    <FilesTabContent />
                  </div>
                </div>
              </div>

              {/* Main content area */}
              {visibleSections.details ? (
                <div className="flex-1">
                  {/* Grouped details - Changed from grid to flex layout to allow proper displacement of multi-inputs */}
                  {formQuery.status === "success" && (
                    <div className="details flex w-full gap-6 min-h-0 flex-1 pe-0 pt-0 pb-0 overflow-x-hidden">
                      {Array.from({ length: detailColumnsCount }).map((_, colIdx) => (
                        <div
                          key={`col-${colIdx}`}
                          className="flex flex-col gap-3 px-4 flex-1 min-w-0" // Added flex-1 and min-w-0 for proper flex distribution
                        >
                          {(detailColumns[colIdx] ?? []).map((group, idx) => (
                            <section
                              key={`${group.groupTitle}-${idx}`}
                              className="flex flex-col gap-3"
                            >
                              <h3 className="text-brand-gray-600 text-sm font-medium">
                                {group.groupTitle}
                              </h3>
                              <div className="flex flex-col gap-3"> {/* Changed from ul to div for better flex compatibility */}
                                {group.fields.map((field, idx) => (
                                  <div
                                    key={idx}
                                    className="flex flex-col" // Changed from flex-row to flex-col for vertical stacking
                                  >
                                    <FieldResolver
                                      key={String(field.id)}
                                      field={field}
                                      control={form.control}
                                    />
                                  </div>
                                ))}
                              </div>
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