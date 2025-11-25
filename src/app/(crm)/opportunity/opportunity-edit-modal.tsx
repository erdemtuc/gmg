"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Modal } from "@/components/ui/modal";
import { useUIStore } from "@/stores/ui";
import { isApiError } from "@/infra/http/errors";
import {
  FormValues,
} from "@/features/shared/models/crud-models";
import { X } from "lucide-react";

interface OpportunityEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId?: string | number;
}

export function OpportunityEditModal({ isOpen, onClose, opportunityId }: OpportunityEditModalProps) {
  const form = useForm<FormValues>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      console.log("Updating opportunity:", opportunityId, values);
      handleClose();
    } catch (e) {
      if (isApiError(e)) {
        const statusMessage = e.status ? `HTTP ${e.status}` : "";
        const descriptionMessage = e.description ? e.description : "";
        const rawMessage =
          e.raw && typeof e.raw === "object" && "error" in e.raw
            ? (e.raw as any).error
            : "";

        const errorMessage =
          descriptionMessage ||
          rawMessage ||
          statusMessage ||
          "Failed to update opportunity";
        setSubmitError(errorMessage);
      } else {
        const msg = e instanceof Error ? e.message : "Unexpected error";
        setSubmitError(msg);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      width="65.5rem"
      hideCloseButton
    >
      <div className="flex flex-col h-full max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <h2 className="text-lg font-medium text-gray-900">Edit Opportunity</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 min-h-0 overflow-hidden"
          >
            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-4 gap-4">
                {/* Row 1 */}
                <div className="col-span-1">
                  <label className="block text-xs font-normal text-gray-600 mb-1.5">Client</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder=""
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-normal text-gray-600 mb-1.5">Opportunity Ref</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder=""
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-normal text-gray-600 mb-1.5">Status</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value=""></option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-normal text-gray-600 mb-1.5">Job</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder=""
                  />
                </div>

                {/* Row 2 */}
                <div className="col-span-1">
                  <label className="block text-xs font-normal text-gray-600 mb-1.5">Quote Amount</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder=""
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-normal text-gray-600 mb-1.5">Total Amount</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder=""
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-normal text-gray-600 mb-1.5">Valid through</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-normal text-gray-600 mb-1.5">Opportunity</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder=""
                  />
                </div>

                {/* Row 3 */}
                <div className="col-span-1">
                  <label className="block text-xs font-normal text-gray-600 mb-1.5">Contact</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder=""
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-normal text-gray-600 mb-1.5">Responsible</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder=""
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-normal text-gray-600 mb-1.5">Upload file</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-xs text-gray-500">Drag & Drop files here or Upload file</p>
                    </div>
                  </div>
                </div>

                {/* Notes - Full Width */}
                <div className="col-span-4">
                  <label className="block text-xs font-normal text-gray-600 mb-1.5">Notes</label>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder=""
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-md transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium px-4 py-2 transition-colors"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                </div>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium px-4 py-2 transition-colors"
                >
                  Copy to New Opportunity
                </button>
              </div>
              {submitError ? (
                <div className="text-red-600 text-xs mt-2">
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