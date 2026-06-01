import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { AreaData, Community } from '../../types';
import { getPriceRange } from '../../utils/stats';
import { formatPriceShort } from '../../utils/format';

export function AreaCard({ area, communities }: { area: AreaData; communities: Community[] }) {
  const { min } = getPriceRange(communities);
  const active = communities.filter(c => c.status === 'Under Construction').length;

  return (
    <Link to={`/areas/${area.slug}`} className="card p-5 hover:shadow-md transition-all group flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-teal-light rounded-lg">
          <MapPin size={16} className="text-teal" />
        </div>
        <h3 className="font-semibold text-primary group-hover:text-teal transition-colors">{area.name}</h3>
      </div>
      <p className="text-sm text-muted line-clamp-2 mb-4 flex-1">{area.description}</p>
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div>
          <span className="text-sm font-bold text-navy">{communities.length}</span>
          <span className="text-xs text-muted ml-1">{communities.length === 1 ? 'community' : 'communities'}</span>
          {active > 0 && <span className="text-xs text-teal ml-2">· {active} active</span>}
        </div>
        <div className="flex items-center gap-1">
          {min && <span className="text-xs text-muted">From {formatPriceShort(min)}</span>}
          <ArrowRight size={14} className="text-teal ml-1" />
        </div>
      </div>
    </Link>
  );
}
