import { Control, Controller, FieldValues } from "react-hook-form";
import { EditField, Option } from "@/features/shared/models/crud-models";
import { useState, useRef, useEffect } from "react";
import { formatFieldLabel } from "@/utils/format-label";

interface SelectInputProps {
  field: EditField;
  control: Control<FieldValues>;
}

export function SelectInput({ field, control }: SelectInputProps) {
  const id = String(field.id);
  const label = field.label || formatFieldLabel(String(field.name));
  const options = field.options ?? [];

  return (
    <div className="input-wrapper">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <Controller
        name={id}
        control={control}
        render={({ field: controllerField }) => (
          <SearchableSelect
            id={id}
            options={options}
            value={String(controllerField.value ?? "")}
            onChange={(value) => controllerField.onChange(value)}
            label={label}
          />
        )}
      />
    </div>
  );
}

function SearchableSelect({
  id,
  options,
  value,
  onChange,
  label,
}: {
  id: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.id) === value);
  const filteredOptions = options.filter((opt) =>
    opt.value.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm("");
      setHighlightedIndex(-1);
      setTimeout(() => {
        inputRef.current?.focus();

        // Auto-scroll to make sure the dropdown is visible when opened
        setTimeout(() => {
          if (dropdownRef.current) {
            const dropdown = dropdownRef.current;
            const dropdownRect = dropdown.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Check if dropdown goes beyond viewport
            if (dropdownRect.bottom > viewportHeight) {
              // Calculate how much to scroll to bring dropdown into view
              const neededScroll = dropdownRect.bottom - viewportHeight + 20; // 20px buffer

              // Try to find the nearest scrollable parent
              let scrollableParent: HTMLElement | null = dropdown.parentElement;
              while (scrollableParent) {
                const style = window.getComputedStyle(scrollableParent);
                if (style.overflowY === 'auto' || style.overflowY === 'scroll' ||
                    style.overflow === 'auto' || style.overflow === 'scroll') {
                  // Found a scrollable parent
                  scrollableParent.scrollTop += neededScroll;
                  break;
                }
                // If we reach the body or document element, scroll the page
                if (scrollableParent === document.body || scrollableParent === document.documentElement) {
                  window.scrollBy(0, neededScroll);
                  break;
                }
                scrollableParent = scrollableParent.parentElement;
              }

              // As fallback, scroll the window if no scrollable parent found
              if (!scrollableParent) {
                window.scrollBy(0, neededScroll);
              }
            }
          }
        }, 0);
      }, 0);
    }
  };

  const handleSelect = (option: Option) => {
    onChange(String(option.id));
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        handleToggle();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(-1);
    }
  }, [searchTerm, isOpen]);

  return (
    <div className="relative">
      <div
        className="input-field flex cursor-pointer items-center justify-between"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption ? selectedOption.value : ""}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg"
        >
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              className="border-brand-gray-300 text-brand-gray-600 w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="text-brand-gray-400 px-3 py-2 text-xs">
                No options found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={String(option.id)}
                  className={`text-brand-gray-600 hover:bg-brand-gray-100 cursor-pointer px-3 py-2 text-xs ${
                    index === highlightedIndex ? "bg-blue-50" : ""
                  } ${
                    String(option.id) === value ? "bg-blue-100 font-medium" : ""
                  }`}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.value}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
