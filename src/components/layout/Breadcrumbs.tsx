import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface Crumb { label: string; to?: string; }
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted flex-wrap">
      <Link to="/" className="hover:text-teal transition-colors flex items-center gap-1"><Home size={13} />Home</Link>
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          <ChevronRight size={13} className="text-muted/50" />
          {c.to ? <Link to={c.to} className="hover:text-teal transition-colors">{c.label}</Link> : <span className="text-primary font-medium">{c.label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}
