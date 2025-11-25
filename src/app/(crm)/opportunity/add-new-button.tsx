import { Plus } from 'lucide-react';
import { useUIStore } from '@/stores/ui';

export default function AddNewButton() {
  const openOpportunityAdd = useUIStore((s) => s.modalState.openOpportunityAdd);

  const handleAddNew = () => {
    openOpportunityAdd();
  };

  return (
    <button
      onClick={handleAddNew}
      className="bg-brand-primary-500 hover:bg-brand-primary-600 text-white flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm"
    >
      <Plus className="size-3.5" />
      <span>Add Opportunity</span>
    </button>
  );
}