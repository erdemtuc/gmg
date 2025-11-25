import React from 'react';
import { Opportunity } from '@/features/shared/models/opportunity-crud-models';
import OpportunityCard from './opportunity-card';

interface OpportunityCardWithSuspenseProps {
  opportunity: Opportunity;
}

export default React.memo(function OpportunityCardWithSuspense({ opportunity }: OpportunityCardWithSuspenseProps) {
  return (
    <React.Suspense fallback={
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        Loading opportunity...
      </div>
    }>
      <OpportunityCard opportunity={opportunity} />
    </React.Suspense>
  );
});