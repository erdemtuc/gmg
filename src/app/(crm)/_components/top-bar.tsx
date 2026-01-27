import Link from "next/link";
import { Search, Calendar, HelpCircle } from "lucide-react";
// import { ReactComponent as CalendarFilledLtrIcon } from "@/icons/calendar-filled-ltr-icon.svg";
// import { ReactComponent as QuestionOutlinedCircleIcon } from "@/icons/question-outlined-circle-icon.svg";

import AccountMenu from "./account-menu";

export default function TopBar() {
  return (
    <div className="border-brand-gray-100 inline-flex h-full w-full items-center justify-between border-b-2 bg-white px-6 py-3">
      <div className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white bg-gradient-to-r from-sky-100/0 to-sky-100 pl-2 ring-2 ring-blue-200">
        <Search className="size-4 text-zinc-400" aria-hidden />
        <input
          id="search"
          type="text"
          placeholder="Search for anything..."
          className="text-height-1 h-full w-80 py-2 pr-1.5 pl-2 text-xs leading-0 font-normal text-gray-600 outline-none placeholder:text-gray-300"
        />
      </div>
      <div className="flex items-center justify-start gap-4">
        <Link href="/calendar" className="inline-flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
          <Calendar className="text-brand-gray-500 size-4" aria-hidden />
          <span className="text-brand-gray-600 text-sm font-medium">
            Calendar
          </span>
        </Link>
        <div className="bg-brand-primary-100 text-brand-primary-500 rounded px-2 py-0.5 text-sm font-medium">
          3
        </div>
        {/* <div>
          <HelpCircle
            className="text-brand-gray-500 size-4"
            aria-hidden
          />
        </div> */}
        <AccountMenu />
      </div>
    </div>
  );
}
