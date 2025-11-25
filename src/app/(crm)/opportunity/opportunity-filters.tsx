import { OpportunityFilter, useOpportunityFilters } from './use-opportunity-filters';
import { X, CirclePlus } from 'lucide-react';

interface FilterItemProps {
  filter: OpportunityFilter;
  index: number;
  onUpdate: (index: number, filter: OpportunityFilter) => void;
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
        className="bg-white text-brand-gray-900 border border-brand-gray-300 rounded px-2 py-1 text-sm"
        value={filter.field}
        onChange={handleFieldChange}
      >
        <option className="text-brand-gray-900" value="name">Name</option>
        <option className="text-brand-gray-900" value="status">Status</option>
        <option className="text-brand-gray-900" value="value">Value</option>
        <option className="text-brand-gray-900" value="probability">Probability</option>
        <option className="text-brand-gray-900" value="assignedTo">Assigned To</option>
        <option className="text-brand-gray-900" value="expectedCloseDate">Expected Close Date</option>
      </select>

      <select
        className="bg-white text-brand-gray-900 border border-brand-gray-300 rounded px-2 py-1 text-sm"
        value={filter.operator}
        onChange={handleOperatorChange}
      >
        <option className="text-brand-gray-900" value="contains">Contains</option>
        <option className="text-brand-gray-900" value="equals">Equals</option>
        <option className="text-brand-gray-900" value="startsWith">Starts with</option>
        <option className="text-brand-gray-900" value="endsWith">Ends with</option>
      </select>

      <input
        type="text"
        className="bg-white text-brand-gray-900 border border-brand-gray-300 rounded px-2 py-1 text-sm flex-1"
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

interface OpportunityFiltersProps {
  showFilters: boolean;
  onToggleFilters: () => void;
}

export const OpportunityFilters = ({ showFilters, onToggleFilters }: OpportunityFiltersProps) => {
  const {
    filters,
    addFilter,
    removeFilter,
    updateFilter,
    clearAllFilters
  } = useOpportunityFilters();

  const handleAddFilter = () => {
    addFilter({
      field: 'name',
      operator: 'contains',
      value: ''
    });
  };

  if (!showFilters) {
    return (
      <button
        className="text-brand-primary-600 bg-brand-primary-50 hover:bg-brand-primary-100 flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5"
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
          className="text-brand-primary-600 bg-brand-primary-50 hover:bg-brand-primary-100 flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm"
          onClick={handleAddFilter}
        >
          + Add filter
        </button>

        {filters.length > 0 && (
          <button
            className="text-brand-gray-700 hover:bg-brand-gray-100 flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm"
            onClick={clearAllFilters}
          >
            Clear all
          </button>
        )}

        <button
          className="ml-auto text-brand-gray-700 hover:bg-brand-gray-100 flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-sm"
          onClick={onToggleFilters}
        >
          Done
        </button>
      </div>
    </div>
  );
};