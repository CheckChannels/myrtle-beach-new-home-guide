import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronDown, ChevronUp, ArrowRight, MapPin } from 'lucide-react';
import { Builder, Community } from '../../types';
import { Badge } from '../ui/Badge';
import { getPriceRange } from '../../utils/stats';
import { formatPriceShort } from '../../utils/format';

interface BuilderCardProps {
  builder: Builder;
  communities: Community[];
}

export function BuilderCard({ builder: b, communities }: BuilderCardProps) {
  const [expanded, setExpanded] = useState(false);
  const active = communities.filter(c => c.status === 'Under Construction').length;
  const future = communities.filter(c => c.status === 'Future Subdivision' || c.status === 'Coming Soon').length;
  const completed = communities.filter(c => c.status === 'Completed' || c.status === 'Recently Completed').length;
  const { min, max } = getPriceRange(communities);

  const initials = b.name.split(/\s+/).slice(0,2).map(w => w[0]).join('').toUpperCase();
  const TYPE_LABEL: Record<string, string> = {
    national: 'National Builder', regional: 'Regional Builder', local: 'Local Builder', custom: 'Custom Homes', unknown: 'Builder TBD',
  };

  return (
    <div className="card overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-lg bg-navy flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initials || <Building2 size={20} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-primary text-base">{b.name}</h3>
                <Badge variant="teal" className="mt-1">{TYPE_LABEL[b.builderType]}</Badge>
              </div>
              <Link to={`/builders/${b.slug}`} className="shrink-0 text-xs font-semibold text-teal hover:text-teal-dark flex items-center gap-1">
                View Profile <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center p-2 bg-bg rounded-lg">
            <p className="text-lg font-bold text-primary">{active}</p>
            <p className="text-xs text-muted">Active</p>
          </div>
          <div className="text-center p-2 bg-bg rounded-lg">
            <p className="text-lg font-bold text-primary">{future}</p>
            <p className="text-xs text-muted">Future</p>
          </div>
          <div className="text-center p-2 bg-bg rounded-lg">
            <p className="text-lg font-bold text-primary">{completed}</p>
            <p className="text-xs text-muted">Completed</p>
          </div>
        </div>

        {/* Price & areas */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {(min || max) && (
            <span className="font-semibold text-navy">
              {min ? formatPriceShort(min) : ''}
              {min && max && min !== max ? ` – ${formatPriceShort(max)}` : ''}
            </span>
          )}
          {b.areasServed.length > 0 && (
            <span className="flex items-center gap-1 text-muted text-xs">
              <MapPin size={11} />{b.areasServed.slice(0,3).join(', ')}{b.areasServed.length > 3 ? ` +${b.areasServed.length-3}` : ''}
            </span>
          )}
        </div>

        {/* Specialties */}
        {b.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {b.specialties.map(s => <Badge key={s} variant="sand">{s}</Badge>)}
          </div>
        )}

        {/* Expand toggle */}
        {communities.length > 0 && (
          <button
            onClick={() => setExpanded(e => !e)}
            aria-expanded={expanded}
            className="mt-4 w-full flex items-center justify-between text-sm font-medium text-teal hover:text-teal-dark transition-colors"
          >
            <span>{communities.length} {communities.length === 1 ? 'community' : 'communities'}</span>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {/* Expanded community list */}
      {expanded && (
        <div className="border-t border-border bg-bg">
          {communities.map(c => (
            <Link key={c.id} to={`/communities/${c.slug}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-sand-light transition-colors border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm font-medium text-primary">{c.name}</p>
                <p className="text-xs text-muted">{c.area} · {c.priceLabel}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge text-xs ${c.status === 'Under Construction' ? 'bg-teal-light text-teal-dark' : 'bg-sand text-primary/60'}`}>{c.status}</span>
                <ArrowRight size={12} className="text-muted" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
