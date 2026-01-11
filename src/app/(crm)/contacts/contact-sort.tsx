import { ContactSort, useContactFilters } from "./use-contact-filters";
import { ChevronUp, ChevronDown } from "lucide-react";
import ChevronOutlinedUpIcon from "@/assets/icons/chevron-outlined-up-icon.svg";
import Image from "next/image";

interface ContactSortComponentProps {
  showSort: boolean;
  onToggleSort: () => void;
}

export const ContactSortComponent = ({
  showSort,
  onToggleSort,
}: ContactSortComponentProps) => {
  const { sort, setSortBy } = useContactFilters();

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort: ContactSort = {
      field: e.target.value,
      direction:
        sort?.field === e.target.value && sort.direction === "asc"
          ? "desc"
          : "asc",
    };
    setSortBy(newSort);
  };

  return (
    <div className="relative">
      <button
        className="text-brand-gray-400 no-background flex cursor-pointer items-center gap-1.5 rounded-md"
        onClick={onToggleSort}
      >
        <span className="text-sm">Sort by</span>
        {sort ? (
          sort.direction === "asc" ? (
            <ChevronUp className="size-3.5" />
          ) : (
            <ChevronDown className="size-3.5" />
          )
        ) : (
          <Image
            src={ChevronOutlinedUpIcon || null}
            width={14}
            height={14}
            alt=""
            className="size-3.5 rotate-180"
          />
        )}
      </button>

      {showSort && (
        <div className="border-brand-gray-200 absolute top-full right-0 z-10 mt-1 min-w-[200px] rounded-md border bg-white shadow-lg">
          <div className="p-2">
            <label className="text-brand-gray-500 mb-1 block text-xs">
              Sort by
            </label>
            <select
              className="border-brand-gray-300 mb-2 w-full rounded border px-2 py-1 text-sm text-gray-700"
              value={sort?.field || ""}
              onChange={handleFieldChange}
            >
              <option value="">Select field</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="company">Company</option>
              <option value="createdAt">Date Created</option>
            </select>

            <div className="flex gap-2">
              <button
                className={`flex-1 rounded py-1 text-xs ${
                  sort?.direction === "asc"
                    ? "bg-brand-primary-500 text-white"
                    : "bg-brand-gray-100 text-gray-700"
                }`}
                onClick={() =>
                  setSortBy({ field: sort?.field || "name", direction: "asc" })
                }
              >
                A-Z
              </button>
              <button
                className={`flex-1 rounded py-1 text-xs ${
                  sort?.direction === "desc"
                    ? "bg-brand-primary-500 text-white"
                    : "bg-brand-gray-100 text-brand-gray-700"
                }`}
                onClick={() =>
                  setSortBy({ field: sort?.field || "name", direction: "desc" })
                }
              >
                Z-A
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
