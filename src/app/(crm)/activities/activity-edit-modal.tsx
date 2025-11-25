"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { useUIStore } from "@/stores/ui";
import { apiClientGet } from "@/infra/http/client";
import type { ActivityEditForm } from "@/features/shared/models/activity-crud-models";
import { updateActivityAction } from "@/features/activity/actions";
import { distributeGroupsToColumns } from "@/features/shared/lib/distribute-groups-to-columns";
import { FieldResolver } from "@/components/ui/inputs";
import {
  EditFieldGroup,
  FormValues,
} from "@/features/shared/models/crud-models";
import { FilesTabContent } from "../contacts/files-tab-content";

type Tab = "details" | "files" | "tasks";

export function ActivityEditModal() {
  const active = useUIStore((s) => s.modalState.active);
  const closeStore = useUIStore((s) => s.modalState.closeModal);

  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen =
    active?.type === "activityEdit" ? active.activityId : null;

  const [activeTab, setActiveTab] = useState<Tab>("details");

  const activityIdFromUrl = params.get("activity_edit_id");
  const activityIdFromUrlValidated = activityIdFromUrl
    ? Number(activityIdFromUrl)
    : null;

  useEffect(() => {
    if (
      activityIdFromUrlValidated &&
      (!isOpen || isOpen !== activityIdFromUrlValidated)
    ) {
      useUIStore.getState().modalState.openActivityEdit(activityIdFromUrlValidated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityIdFromUrlValidated]);

  const handleClose = () => {
    const sp = new URLSearchParams(Array.from(params.entries()));
    sp.delete("activity_edit_id");
    router.replace(sp.size ? `${pathname}?${sp.toString()}` : pathname, {
      scroll: false,
    });
    closeStore();
  };

  const formQuery = useQuery({
    queryKey: ["activityEditForm", isOpen],
    enabled: !!isOpen,
    queryFn: async () =>
      apiClientGet<ActivityEditForm>(`/api/activities/edit-form`, {
        query: { id: String(isOpen) },
      }),
    staleTime: 0,
    gcTime: 60_000,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
  });

  const form = useForm<FormValues>({});

  useEffect(() => {
    if (formQuery.status === "success") {
      const allFields = [
        ...(formQuery.data.mainFields ?? []),
        ...(formQuery.data.fieldGroups ?? []).flatMap((g) => g.fields),
      ];
      allFields.forEach((field) => {
        form.setValue(String(field.id), field.value);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formQuery.status, formQuery.data]);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    if (!isOpen) return;
    setSubmitError(null);
    try {
      const result = await updateActivityAction(String(isOpen), values);
      if (!result?.ok) {
        setSubmitError(result?.error || "Failed to update activity");
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
      title="Edit activity"
    >
      <div>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            {/* Activity header and sub collections */}
            <div className="border-brand-gray-100 flex border-y-1">
              {/* Activity header information */}
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

              {/* Activity sub collections */}
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
                } scroll-thin scrollbar-on-white scrollbar-gutter:stable max-h-96 min-h-0 gap-y-3 divide-x overflow-x-hidden overflow-y-auto pe-0 pt-4 pb-8`}
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

            {/* Actions */}
            <div className="my-4 flex flex-col gap-4 p-4">
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
                <div className="text-brand-error-500 text-xs">
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
