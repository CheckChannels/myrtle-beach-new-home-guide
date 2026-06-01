import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}

export function StatCard({ icon: Icon, label, value, sub, color = 'text-teal' }: StatCardProps) {
  return (
    <div className="card p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-lg bg-teal-light ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-primary">{value}</p>
        <p className="text-sm font-medium text-primary mt-0.5">{label}</p>
        {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
