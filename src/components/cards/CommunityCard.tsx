import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Scale, ArrowRight, Calendar, Home } from 'lucide-react';
import { Community } from '../../types';
import { StatusBadge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import { getBedBathLabel, getSqftLabel } from '../../utils/format';

interface CommunityCardProps {
  community: Community;
  compact?: boolean;
}

export function CommunityCard({ community: c, compact }: CommunityCardProps) {
  const { toggleFavorite, isFavorite, addToComparison, isInComparison, removeFromComparison } = useApp();
  const { showToast } = useToast();
  const fav = isFavorite(c.id);
  const inComp = isInComparison(c.id);

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inComp) { removeFromComparison(c.id); showToast('Removed from comparison', 'info'); return; }
    const ok = addToComparison(c.id);
    if (ok) showToast('Added to comparison');
    else showToast('You can compare up to 4 communities at a time', 'error');
  };

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(c.id);
    showToast(fav ? 'Removed from saved' : 'Saved to favorites');
  };

  const img = c.imageUrls[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80';

  return (
    <Link to={`/communities/${c.slug}`} className="card group flex flex-col overflow-hidden hover:shadow-lg transition-all">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img src={img} alt={c.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3"><StatusBadge status={c.status} /></div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button onClick={handleFav} aria-label={fav ? 'Remove from saved' : 'Save community'}
            className={`p-1.5 rounded-full shadow transition-all ${fav ? 'bg-coral text-white' : 'bg-white/90 text-muted hover:text-coral'}`}>
            <Heart size={14} fill={fav ? 'currentColor' : 'none'} />
          </button>
          <button onClick={handleCompare} aria-label={inComp ? 'Remove from compare' : 'Add to compare'}
            className={`p-1.5 rounded-full shadow transition-all ${inComp ? 'bg-teal text-white' : 'bg-white/90 text-muted hover:text-teal'}`}>
            <Scale size={14} />
          </button>
        </div>
        {c.dataConfidence === 'Low' && (
          <div className="absolute bottom-0 left-0 right-0 bg-warning/80 text-white text-xs px-3 py-1 text-center">
            Preliminary info — verify with builder
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-1">
          <p className="text-xs text-muted font-medium">{c.builderName}</p>
          <h3 className="font-semibold text-primary text-base leading-snug group-hover:text-teal transition-colors">{c.name}</h3>
        </div>
        <div className="flex items-center gap-1 text-muted text-xs mb-3">
          <MapPin size={12} />{c.area}, {c.state}
        </div>
        <div className="text-sm font-bold text-navy mb-2">{c.priceLabel}</div>

        {!compact && (
          <>
            {(c.minBeds || c.minBaths || c.minSqft) && (
              <div className="flex items-center gap-2 text-xs text-muted mb-2">
                <Home size={12} />
                {getBedBathLabel(c.minBeds, c.maxBeds, c.minBaths, c.maxBaths)}
                {c.minSqft && <> · {getSqftLabel(c.minSqft, c.maxSqft)}</>}
              </div>
            )}
            {c.propertyTypes.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {c.propertyTypes.slice(0,3).map(t => (
                  <span key={t} className="badge bg-sand text-primary/70 text-xs">{t}</span>
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted">
            <Calendar size={11} /> {c.lastVerified}
          </div>
          <span className="text-xs font-semibold text-teal flex items-center gap-1">View Details <ArrowRight size={12} /></span>
        </div>
      </div>
    </Link>
  );
}
