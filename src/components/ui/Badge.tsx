import React from 'react';
import { CommunityStatus } from '../../types';

const STATUS_STYLES: Record<CommunityStatus, string> = {
  'Under Construction': 'bg-teal-light text-teal-dark border border-teal/20',
  'Future Subdivision': 'bg-warning/10 text-amber-700 border border-warning/30',
  'Coming Soon': 'bg-blue-50 text-blue-700 border border-blue-200',
  'Recently Completed': 'bg-success/10 text-green-700 border border-success/20',
  'Completed': 'bg-gray-100 text-gray-600 border border-gray-200',
  'Leasing': 'bg-purple-50 text-purple-700 border border-purple-200',
  'Sold Out': 'bg-red-50 text-error border border-red-200',
  'Price TBD': 'bg-sand text-primary/70 border border-sand-dark',
};

export function StatusBadge({ status }: { status: CommunityStatus }) {
  return (
    <span className={`badge text-xs font-medium ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'teal' | 'navy' | 'sand' | 'coral' | 'gray';
  className?: string;
}

export function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  const variants = {
    teal: 'bg-teal-light text-teal-dark',
    navy: 'bg-navy/10 text-navy',
    sand: 'bg-sand text-primary/70',
    coral: 'bg-coral-light text-coral-dark',
    gray: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
