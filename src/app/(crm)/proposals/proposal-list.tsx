"use client";

import { Star, User } from "lucide-react";

type ProposalStatus = "Accepted" | "Prospect" | "Lead";

interface Proposal {
  id: string;
  name: string;
  type: "organization" | "person";
  status: ProposalStatus;
  quoteAmount: number;
  validThrough: string;
  filesCount?: number;
  jobId?: string;
  sentBy?: string;
  responsible?: string;
}

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "1",
    name: "Jeff Karsten - Farmers Cooperative Association",
    type: "organization",
    status: "Accepted",
    quoteAmount: 345,
    validThrough: "02/18/2025",
  },
  {
    id: "2",
    name: "Kephart Feed and Farm Supply - Galesburg",
    type: "person",
    status: "Prospect",
    quoteAmount: 345,
    validThrough: "02/20/2025",
    filesCount: 1,
    jobId: "10001",
    sentBy: "Fax",
    responsible: "Uli Olianovska",
  },
  {
    id: "3",
    name: "Producers Cooperative Association - Girard",
    type: "organization",
    status: "Lead",
    quoteAmount: 1340,
    validThrough: "02/18/2025",
  },
  {
    id: "4",
    name: "Western Feed Mills - Cedar Vale",
    type: "organization",
    status: "Lead",
    quoteAmount: 13457,
    validThrough: "02/19/2025",
  },
  {
    id: "5",
    name: "Western Feed Mills - Cedar Vale",
    type: "organization",
    status: "Lead",
    quoteAmount: 891,
    validThrough: "04/12/2025",
  },
  {
    id: "6",
    name: "Producers Cooperative Association - Girard",
    type: "organization",
    status: "Lead",
    quoteAmount: 1125,
    validThrough: "03/03/2025",
  },
];

export default function ProposalList() {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto pb-4">
      {MOCK_PROPOSALS.map((proposal) => (
        <div
          key={proposal.id}
          className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  proposal.status === "Accepted"
                    ? "bg-green-100 text-green-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {proposal.status === "Accepted" ? (
                  <Star className="h-5 w-5 fill-current" />
                ) : (
                  <User className="h-5 w-5 fill-current" />
                )}
              </div>
              <h3 className="text-base font-medium text-gray-900">
                {proposal.name}
              </h3>
            </div>
            <span
              className={`text-sm font-medium ${
                proposal.status === "Accepted"
                  ? "text-green-600"
                  : "text-blue-600"
              }`}
            >
              {proposal.status}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-4 pl-11">
            <div className="col-span-6 sm:col-span-3">
              <p className="text-xs text-gray-500">Quote Amount</p>
              <p className="text-sm font-semibold text-gray-900">
                ${proposal.quoteAmount.toLocaleString()}
              </p>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <p className="text-xs text-gray-500">Valid through</p>
              <p className="text-sm text-gray-900">{proposal.validThrough}</p>
            </div>
            
            {/* Extra details row if available */}
            {(proposal.filesCount || proposal.jobId || proposal.sentBy || proposal.responsible) && (
              <>
                <div className="col-span-12 border-t border-gray-100 my-1"></div>
                
                {proposal.filesCount && (
                  <div className="col-span-6 sm:col-span-3">
                    <p className="text-xs text-gray-500">Files/Images</p>
                    <p className="text-sm text-blue-600 cursor-pointer hover:underline">
                      Open
                    </p>
                  </div>
                )}
                
                {proposal.jobId && (
                  <div className="col-span-6 sm:col-span-3">
                    <p className="text-xs text-gray-500">Job</p>
                    <p className="text-sm text-blue-600 cursor-pointer hover:underline">
                      {proposal.jobId}
                    </p>
                  </div>
                )}

                {proposal.sentBy && (
                  <div className="col-span-6 sm:col-span-3">
                    <p className="text-xs text-gray-500">Sent by</p>
                    <p className="text-sm text-gray-900">{proposal.sentBy}</p>
                  </div>
                )}

                {proposal.responsible && (
                  <div className="col-span-6 sm:col-span-3">
                    <p className="text-xs text-gray-500">Responsible</p>
                    <p className="text-sm text-blue-600 cursor-pointer hover:underline">
                      {proposal.responsible}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
      
      <div className="flex justify-center mt-2">
        <button className="rounded-full bg-white p-1 shadow-sm border border-gray-200 hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="m6 9 6 6 6-6"/></svg>
        </button>
      </div>
    </div>
  );
}
