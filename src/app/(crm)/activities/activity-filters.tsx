import { ActivityFilter, useActivityFilters } from './use-activity-filters';
import { X, CirclePlus } from 'lucide-react';

interface FilterItemProps {
  filter: ActivityFilter;
  index: number;
  onUpdate: (index: number, filter: ActivityFilter) => void;
  onRemove: (index: number) => void;
}

const FilterItem = ({ filter, index, onUpdate, onRemove }: FilterItemProps) => {
  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(index, { ...filter, field: e.target.value });
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate(index, { ...filter, operator: e.target.value });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(index, { ...filter, value: e.target.value });
  };

  return (
    <div className="flex items-center gap-2 bg-brand-gray-50 px-3 py-2 rounded-md">
      <select
        className="bg-white border border-brand-gray-300 rounded px-2 py-1 text-sm"
        value={filter.field}
        onChange={handleFieldChange}
      >
        <option value="title">Title</option>
        <option value="description">Description</option>
        <option value="assignee">Assignee</option>
        <option value="status">Status</option>
        <option value="priority">Priority</option>
        <option value="dueDate">Due Date</option>
      </select>

      <select
        className="bg-white border border-brand-gray-300 rounded px-2 py-1 text-sm"
        value={filter.operator}
        onChange={handleOperatorChange}
      >
        <option value="contains">Contains</option>
        <option value="equals">Equals</option>
        <option value="startsWith">Starts with</option>
        <option value="endsWith">Ends with</option>
      </select>

      <input
        type="text"
        className="bg-white border border-brand-gray-300 rounded px-2 py-1 text-sm flex-1"
        placeholder="Value..."
        value={filter.value}
        onChange={handleValueChange}
      />

      <button
        onClick={() => onRemove(index)}
        className="text-brand-gray-500 hover:text-brand-gray-700"
      >
        <X size={16} />
      </button>
    </div>
  );
};

interface ActivityFiltersProps {
  showFilters: boolean;
  onToggleFilters: () => void;
}

export const ActivityFilters = ({ showFilters, onToggleFilters }: ActivityFiltersProps) => {
  const {
    filters,
    addFilter,
    removeFilter,
    updateFilter,
    clearAllFilters
  } = useActivityFilters();

  const handleAddFilter = () => {
    addFilter({
      field: 'title',
      operator: 'contains',
      value: ''
    });
  };

  if (!showFilters) {
    return (
      <button
        className="text-brand-primary-500 bg-brand-primary-50 hover:bg-brand-primary-100 flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5"
        onClick={onToggleFilters}
      >
        <span className="text-sm leading-1">Add filters</span>
        <CirclePlus className="size-3.5" />
      </button>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {filters.map((filter, index) => (
          <FilterItem
            key={index}
            index={index}
            filter={filter}
            onUpdate={updateFilter}
            onRemove={removeFilter}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button
          className="text-brand-primary-500 bg-brand-primary-50 hover:bg-brand-primary-100 flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm"
          onClick={handleAddFilter}
        >
          + Add filter
        </button>

        {filters.length > 0 && (
          <button
            className="text-brand-gray-500 hover:bg-brand-gray-100 flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm"
            onClick={clearAllFilters}
          >
            Clear all
          </button>
        )}

        <button
          className="ml-auto text-brand-gray-500 hover:bg-brand-gray-100 flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm"
          onClick={onToggleFilters}
        >
          Done
        </button>
      </div>
    </div>
  );
};