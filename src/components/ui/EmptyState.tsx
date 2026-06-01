import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export function EmptyState({ title = 'No results found', description = 'Try adjusting your filters or search terms.', onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <SearchX size={48} className="text-muted/50 mb-4" />
      <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
      <p className="text-muted max-w-sm mb-6">{description}</p>
      {onReset && <Button variant="secondary" onClick={onReset}>Reset Filters</Button>}
    </div>
  );
}
