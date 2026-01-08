"use client";

import { useState, useRef, useEffect } from "react";
import { ContactFilter, useContactFilters } from "./use-contact-filters";
import { X, Search } from "lucide-react";
import AddOutlinedCircleIcon from "@/assets/icons/add-outlined-circle-icon.svg";
import Image from "next/image";

const FILTER_OPTIONS = [
  { value: "client", label: "Client" },
  { value: "type", label: "Type" },
  { value: "dateCreated", label: "Date Created" },
  { value: "dateLastEdited", label: "Date Last Edited" },
  { value: "lastEditedBy", label: "Last Edited By" },
  { value: "enteredBy", label: "Entered By" },
  { value: "state", label: "State" },
  { value: "cityTown", label: "City/Town" },
  { value: "country", label: "Country" },
  { value: "zipCode", label: "Zip Code" },
  { value: "taxId", label: "Tax ID" },
  { value: "jobTitle", label: "Job Title" },
  { value: "channel", label: "Channel" },
  { value: "source", label: "Source" },
  { value: "webPage", label: "Web Page" },
];

interface ActiveFilterChipProps {
  filter: ContactFilter;
  index: number;
  onRemove: (index: number) => void;
}

const ActiveFilterChip = ({ filter, index, onRemove }: ActiveFilterChipProps) => {
  const label = FILTER_OPTIONS.find((opt) => opt.value === filter.field)?.label || filter.field;

  return (
    <div className="flex items-center gap-1.5 rounded-md bg-brand-primary-50 px-2 py-1 text-sm text-brand-primary-500">
      <span>{label}: {filter.value}</span>
      <button
        onClick={() => onRemove(index)}
        className="hover:text-brand-primary-700"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export const ContactFilters = () => {
  const { filters, addFilter, removeFilter, clearAllFilters } =
    useContactFilters();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = FILTER_OPTIONS.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectFilter = (field: string) => {
    addFilter({
      field,
      operator: "contains",
      value: "",
    });
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative" ref={dropdownRef}>
        <button
          className="text-brand-primary-500 bg-brand-primary-50 hover:bg-brand-primary-100 flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="text-sm leading-1">Add filters</span>
          <Image
            src={AddOutlinedCircleIcon || null}
            width={14}
            height={14}
            alt=""
            className="size-3.5"
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-md border border-brand-gray-200 bg-white shadow-lg">
            <div className="border-b border-brand-gray-200 p-2">
              <div className="flex items-center gap-2 rounded-md border border-brand-gray-200 px-2 py-1.5">
                <Search size={16} className="text-brand-gray-400" />
                <input
                  type="text"
                  placeholder="Search filter..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-brand-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto py-1">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  className="w-full px-3 py-2 text-left text-sm text-brand-gray-700 hover:bg-brand-gray-50"
                  onClick={() => handleSelectFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-3 py-2 text-sm text-brand-gray-400">
                  No filters found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {filters.map((filter, index) => (
        <ActiveFilterChip
          key={index}
          index={index}
          filter={filter}
          onRemove={removeFilter}
        />
      ))}

      {filters.length > 0 && (
        <button
          className="text-brand-gray-500 hover:text-brand-gray-700 text-sm"
          onClick={clearAllFilters}
        >
          Clear all
        </button>
      )}
    </div>
  );
};
