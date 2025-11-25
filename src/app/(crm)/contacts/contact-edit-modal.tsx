"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { useUIStore } from "@/stores/ui";
import { apiClientGet } from "@/infra/http/client";
import type {
  ContactEditForm,
  ContactType,
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
import { FilesTabContent } from "./files-tab-content";
import { TasksTabContent } from "./tasks-tab-content";
import { Search, UserPlus, Settings, X, History } from "lucide-react";

type Tab = "details" | "files" | "tasks";

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

  const idFromUrl = params.get("contact_edit_id");

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

  const form = useForm<FormValues>({});

  // Reset form when data is loaded
  useEffect(() => {
    if (formQuery.data) {
      // Convert the ContactEditForm to FormValues format
      const formValues: FormValues = {};

      // Add main fields
      if (formQuery.data.mainFields) {
        formQuery.data.mainFields.forEach((field) => {
          formValues[field.name] = field.value;
        });
      }

      // Add grouped fields
      if (formQuery.data.fieldGroups) {
        formQuery.data.fieldGroups.forEach((group) => {
          group.fields.forEach((field) => {
            formValues[field.name] = field.value;
          });
        });
      }

      form.reset(formValues);
    }
  }, [formQuery.data, form]);

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

  const detailColumnsCount: number = 3;
  const detailColumns: EditFieldGroup[][] =
    formQuery.status !== "success"
      ? []
      : distributeGroupsToColumns(
          formQuery.data.fieldGroups,
          detailColumnsCount,
        );

  return (
    <Modal
      isOpen={!!isOpen}
      onClose={handleClose}
      width="65.5rem"
      hideCloseButton
    >
      <div className="flex flex-col h-full max-h-[85vh]">
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

            <button className="border-brand-gray-200 hover:border-brand-primary-400 inline-flex cursor-pointer items-center gap-2 rounded-sm border-1 px-3 py-1.5 transition-colors bg-white">
              <Settings className="size-4 text-blue-600" />
              <span className="text-brand-gray-600 text-sm font-medium">Change layout</span>
            </button>

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
            className="flex flex-col flex-1 min-h-0 overflow-hidden"
          >
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto scroll-thin scrollbar-on-white">
              {/* Contact header and sub collections */}
              <div className="border-brand-gray-100 flex border-y-1">
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
                    (formQuery.data.mainFields ?? []).map((field) => (
                      <FieldResolver
                        key={String(field.id)}
                        field={field}
                        control={form.control}
                      />
                    ))}
                </div>

                {/* Contact sub collections */}
                <div className="bg-brand-gray-50 basis-1/3 p-4">
                  <div className="flex items-center gap-6 border-b border-gray-200">
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

                  {activeTab === "files" && (
                    <div className="mt-4">
                      <FilesTabContent />
                    </div>
                  )}

                  {activeTab === "tasks" && (
                    <div className="mt-4">
                      <TasksTabContent />
                    </div>
                  )}
                </div>
              </div>

              {/* Grouped details */}
              {formQuery.status === "success" && (
                <div
                  className={`details divide-brand-gray-200 grid ${
                    detailColumnsCount === 2 ? "grid-cols-2" : "grid-cols-3"
                  } gap-y-3 divide-x pe-0 pt-4 pb-8`}
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

            {/* Actions - Fixed at bottom */}
            <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-white">
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
