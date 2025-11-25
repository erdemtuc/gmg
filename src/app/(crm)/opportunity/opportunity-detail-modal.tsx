"use client";

import { useState } from "react";
import { useUIStore } from "@/stores/ui";
import { Modal } from "@/components/ui/modal";
import { Search, Edit, Copy, Plus, Settings, X, History } from "lucide-react";

type Tab = "files" | "tasks";

interface OpportunityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId?: string | number;
}

export function OpportunityDetailModal({ isOpen, onClose, opportunityId }: OpportunityDetailModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("tasks");

  const handleClose = () => {
    onClose();
  };

  // Mock data - replace with actual API call
  const opportunityData = {
    id: "10008",
    status: "Accepted",
    createdDate: "21 Dec. 2023",
    createdBy: "Mike Puckett",
    internalId: "0130458",
    notes: "he wants to buy 5 gr, bla bla bla, test... The T&S team is here to uphold that trust -and keep you safe. We do that by establishing rules about what's allowed, and then identifying and dealing with anything (or anyone) that could damage t...",
    details: {
      client: "Tiffin Farmers",
      proposalRef: "10008",
      job: "10001",
      quoteAmount: "$294",
      contact: "-",
      validThrough: "02/19/2025",
      responsible: "Lilia Olianovska",
      sentBy: "Fax",
    },
    products: [
      {
        id: "1",
        name: "Cleveland - Bag Mix n Fine",
        description: "02-Greenx bala af",
        qty: 12,
        price: 250.0,
        discount: 15.0,
        total: 2830.0,
      },
      {
        id: "2",
        name: "Hutchinson - Bulk Agriflow",
        description: "04-Greenx bala af",
        qty: 12,
        price: 1250.0,
        discount: 15.0,
        total: 7250.0,
      },
    ],
    totals: {
      totalCost: 5520.0,
      totalProfit: 12345.0,
      subtotal: 15520.0,
      discount: 520.0,
      tax15: 750.0,
      tax10: 750.0,
      invoiceTotal: 15750.0,
    },
  };

  const tasks = [
    {
      id: "1",
      title: "Phone call: Tiffin - was not willing to ta...",
      date: "Next week (Jan 1 2025) 09:00 am",
      assignedTo: "Mike Puckett",
      lastEdit: "1 month ago (Oct 28 2024) 10:34 am Mike Puckett",
    },
    {
      id: "2",
      title: "Phone call: Tiffin - was not willing to ta...",
      date: "Next week (Jan 1 2025) 09:00 am",
      assignedTo: "Mike Puckett",
      lastEdit: "1 month ago (Oct 28 2024) 10:34 am Mike Puckett",
    },
    {
      id: "3",
      title: "Phone call: Tiffin - was not willing to ta...",
      date: "Next week (Jan 1 2025) 09:00 am",
      assignedTo: "Mike Puckett",
      lastEdit: "1 month ago (Oct 28 2024) 10:34 am Mike Puckett",
    },
    {
      id: "4",
      title: "Phone call: Tiffin - was not willing to ta...",
      date: "Next week (Jan 1 2025) 09:00 am",
      assignedTo: "Mike Puckett",
      lastEdit: "1 month ago (Oct 28 2024) 10:34 am Mike Puckett",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width="70rem" hideCloseButton>
      <div className="flex flex-col max-h-[90vh]">
        {/* Header with search and actions */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 flex-shrink-0">
          {/* Search Bar */}
          <div className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white pl-3 pr-2 py-1.5">
            <Search className="size-4 text-gray-500" aria-hidden />
            <input
              type="text"
              className="w-64 text-sm text-gray-700 outline-none placeholder:text-gray-400"
              placeholder="Search in contact details..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => {
                // Open the edit opportunity modal and close the detail modal
                handleClose();
                useUIStore.getState().modalState.openOpportunityEdit(opportunityId || '');
              }}
            >
              <Edit className="size-4 text-gray-700" />
              <span>Edit</span>
            </button>

            <button className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Copy className="size-4 text-gray-700" />
              <span>Copy</span>
            </button>

            <button className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Plus className="size-4 text-gray-700" />
              <span>Add Activity / Task</span>
            </button>

            <button className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Settings className="size-4 text-gray-700" />
              <span>Change layout</span>
            </button>

            <button className="inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <History className="size-4 text-gray-700" />
              <span>History</span>
            </button>

            <button
              onClick={handleClose}
              className="ml-2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content - Two columns layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column - Main Content */}
          <div className="flex-1 overflow-y-auto p-6 border-b border-gray-200">
            {/* ID and Status */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-semibold text-gray-900">{opportunityData.id}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-700">{opportunityData.status}</span>
                  </span>
                </div>
              </div>
              <div className="text-right text-xs text-gray-500">
                <div>
                  ID:{opportunityData.internalId} • Created {opportunityData.createdDate} by{" "}
                  {opportunityData.createdBy}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{opportunityData.notes}</p>
            </div>

            {/* Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Details</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Client</span>
                  <span className="text-sm text-blue-600 font-medium">
                    {opportunityData.details.client}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Job</span>
                  <span className="text-sm text-blue-600 font-medium">
                    {opportunityData.details.job}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Proposal Ref</span>
                  <span className="text-sm text-gray-900">{opportunityData.details.proposalRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quote Amount</span>
                  <span className="text-sm text-gray-900">{opportunityData.details.quoteAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Contact</span>
                  <span className="text-sm text-gray-900">{opportunityData.details.contact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Valid through</span>
                  <span className="text-sm text-gray-900">{opportunityData.details.validThrough}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Responsible</span>
                  <span className="text-sm text-gray-900">{opportunityData.details.responsible}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sent by</span>
                  <span className="text-sm text-gray-900">{opportunityData.details.sentBy}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tasks & Activities */}
          <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-4 py-0 flex-shrink-0">
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
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "files" && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">No Files & Images</h4>
                  <p className="text-xs text-gray-500 mb-4">
                    You don't have any Files & Images added yet
                  </p>
                </div>
              )}

              {activeTab === "tasks" && (
                <div className="space-y-3">
                  {/* Filter/Sort Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative flex-1 mr-2">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                      />
                    </div>
                    <select className="text-xs border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white">
                      <option className="text-gray-700">Display: All</option>
                    </select>
                    <select className="text-xs border border-gray-300 rounded px-2 py-1.5 ml-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 bg-white">
                      <option className="text-gray-700">Sorting: Default</option>
                    </select>
                  </div>

                  {/* Task List */}
                  {tasks.map((task) => (
                    <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm text-gray-900 font-medium truncate">{task.title}</h4>
                          <div className="mt-1 space-y-0.5">
                            <div className="flex items-center gap-1 text-xs text-gray-700">
                              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{task.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-700">
                              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>Assigned to: {task.assignedTo}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Last edit: {task.lastEdit}</span>
                            </div>
                          </div>
                        </div>
                        <button className="text-gray-500 hover:text-gray-700">
                          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}