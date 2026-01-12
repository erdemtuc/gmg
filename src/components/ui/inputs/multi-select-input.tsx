import { Control, Controller, FieldValues } from "react-hook-form";
import { EditField, Option } from "@/features/shared/models/crud-models";
import { useState, useRef, useEffect } from "react";
import { formatFieldLabel } from "@/utils/format-label";

interface MultiSelectInputProps {
  field: EditField;
  control: Control<FieldValues>;
}

export function MultiSelectInput({ field, control }: MultiSelectInputProps) {
  const name = field.name;
  const id = String(field.id);
  const label = field.label || formatFieldLabel(String(field.name));
  const options = field.options ?? [];

  return (
    <div className="input-wrapper h-auto">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: controllerField }) => (
          <SearchableMultiSelect
            id={id}
            options={options}
            value={toArray(controllerField.value)}
            onChange={(vals) => controllerField.onChange(vals)}
            label={label}
          />
        )}
      />
    </div>
  );
}

function SearchableMultiSelect({
  id,
  options,
  value,
  onChange,
  label,
}: {
  id: string;
  options: Option[];
  value: Array<string | number>;
  onChange: (vals: Array<string | number>) => void;
  label: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    const optionId = String(option.id);
    if (value.includes(optionId)) {
      onChange(value.filter((v) => String(v) !== optionId));
    } else {
      onChange([...value, optionId]);
    }
  };

  const handleRemove = (optionId: string | number) => {
    onChange(value.filter((v) => String(v) !== String(optionId)));
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
        className="input-field flex min-h-10 cursor-pointer items-start justify-between py-2"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={label}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1">
          {value.length > 0 ? (
            value.map((v) => {
              const option = options.find((o) => String(o.id) === String(v));
              return (
                <span
                  key={String(v)}
                  className="bg-brand-primary-50 text-brand-primary-600 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs"
                >
                  {option?.value ?? String(v)}
                  <button
                    type="button"
                    className="text-brand-primary-600 hover:text-brand-primary-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(v);
                    }}
                  >
                    ×
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-gray-500">Select options...</span>
          )}
        </div>
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
              filteredOptions.map((option, index) => {
                const isSelected = value.includes(String(option.id));
                return (
                  <div
                    key={String(option.id)}
                    className={`text-brand-gray-600 hover:bg-brand-gray-100 flex cursor-pointer items-center justify-between px-3 py-2 text-xs ${
                      index === highlightedIndex ? "bg-blue-50" : ""
                    } ${isSelected ? "bg-blue-100 font-medium" : ""}`}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <span>{option.value}</span>
                    {isSelected && (
                      <svg
                        className="h-4 w-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function toArray(v: unknown): Array<string | number> {
  if (Array.isArray(v)) return v as Array<string | number>;
  if (v == null || v === "") return [];
  return [v as string | number];
}
