import { useUIStore } from '@/stores/ui';
import { Opportunity } from '@/features/shared/models/opportunity-crud-models';
import { Star, User } from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const openOpportunityDetail = useUIStore((s) => s.modalState.openOpportunityDetail);

  const handleOpenDetail = () => {
    openOpportunityDetail(opportunity.id.toString());
  };

  // Determine status color and icon background based on status
  const statusColor = opportunity.status?.toLowerCase() === 'closed'
    ? 'text-red-600'
    : opportunity.status?.toLowerCase() === 'won'
    ? 'text-green-600'
    : 'text-blue-600';

  const iconBg = opportunity.status?.toLowerCase() === 'closed'
    ? 'bg-red-100'
    : opportunity.status?.toLowerCase() === 'won'
    ? 'bg-green-100'
    : 'bg-blue-100';

  const isAccepted = opportunity.status?.toLowerCase() === 'won';

  return (
    <div
      className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleOpenDetail}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}>
            {isAccepted ? (
              <Star className="h-5 w-5 fill-current text-yellow-500" />
            ) : (
              <User className="h-5 w-5 fill-current text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900">
              {opportunity.name}
            </h3>
            <span className={`text-sm font-medium ${statusColor}`}>
              {opportunity.status}
            </span>
          </div>
        </div>
        <span className="text-sm text-gray-400">#{opportunity.id}</span>
      </div>

      <div className="h-px w-full bg-gray-200 my-2"></div>

      <div className="grid grid-cols-12 gap-4 pl-11">
        <div className="col-span-6 sm:col-span-3">
          <p className="text-xs text-gray-500">Quote Amount</p>
          <p className="text-sm font-semibold text-gray-900">
            ${Number(opportunity.value || 0).toLocaleString()}
          </p>
        </div>
        <div className="col-span-6 sm:col-span-3">
          <p className="text-xs text-gray-500">Valid through</p>
          <p className="text-sm text-gray-900">{opportunity.expectedCloseDate || '-'}</p>
        </div>
      </div>
    </div>
  );
}