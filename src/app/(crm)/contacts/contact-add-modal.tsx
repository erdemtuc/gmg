"use client";

import { useEffect, useState } from "react";
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
import { FilesTabContent } from "./files-tab-content";
import { Search, UserPlus, Settings, X, History } from "lucide-react";

type Tab = "details" | "files" | "tasks";

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

  const typeFromUrl = params.get("contact_add_type");
  const typeFromUrlValidated =
    typeFromUrl === "O" || typeFromUrl === "P"
      ? (typeFromUrl as ContactType)
      : null;

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
    staleTime: 0,
    gcTime: 60_000,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
  });

  const form = useForm<FormValues>({});

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
          <div className="relative w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              placeholder="Search in contact details..."
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
            currentType={activeType}
            typeFieldName="type"
            paramName="contact_add_type"
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
                    <div className="mt-4 text-center text-sm text-gray-500">
                      Tasks & Activities content coming soon
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
