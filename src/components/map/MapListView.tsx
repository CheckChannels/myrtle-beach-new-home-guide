import React, { useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Heart, Scale } from 'lucide-react';
import { Community } from '../../types';
import { StatusBadge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';
import { useToast } from '../ui/Toast';
import { communityCoords } from '../../data/communityCoords';

// Lazy-load the map so Leaflet only downloads when needed
const CommunityMap = lazy(() =>
  import('./CommunityMap').then(m => ({ default: m.CommunityMap }))
);

interface MapListViewProps {
  communities: Community[];
}

export function MapListView({ communities }: MapListViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { toggleFavorite, isFavorite, addToComparison, isInComparison, removeFromComparison } = useApp();
  const { showToast } = useToast();

  const selectedCommunity = communities.find(c => c.id === selectedId);

  const handleCompare = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (isInComparison(id)) { removeFromComparison(id); showToast('Removed from comparison'); return; }
    if (!addToComparison(id)) showToast('Max 4 communities for comparison', 'error');
    else showToast('Added to comparison');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-0 rounded-xl border border-border overflow-hidden bg-white shadow-sm" style={{ minHeight: 560 }}>
      {/* Scrollable list panel */}
      <div className="lg:w-80 xl:w-96 shrink-0 overflow-y-auto border-r border-border" style={{ maxHeight: 620 }}>
        <div className="p-3 border-b border-border bg-bg sticky top-0 z-10">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide">
            {communities.length} {communities.length === 1 ? 'Community' : 'Communities'}
            {' '}· {communities.filter(c => communityCoords[c.slug]).length} on map
          </p>
        </div>
        {communities.map(c => {
          const hasPinData = Boolean(communityCoords[c.slug]);
          const isSelected = c.id === selectedId;
          const fav = isFavorite(c.id);
          const inComp = isInComparison(c.id);
          return (
            <div
              key={c.id}
              onClick={() => hasPinData && setSelectedId(isSelected ? null : c.id)}
              className={`group border-b border-border last:border-0 transition-colors cursor-pointer
                ${isSelected ? 'bg-teal-light/60' : 'hover:bg-sand-light/60'}
                ${!hasPinData ? 'opacity-60' : ''}`}
            >
              <div className="flex gap-3 p-3">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-sand">
                  <img
                    src={c.imageUrls[0]}
                    alt={c.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <p className="text-xs text-muted truncate">{c.builderName}</p>
                      <p className="text-sm font-semibold text-primary leading-snug group-hover:text-teal transition-colors line-clamp-1">{c.name}</p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="flex items-center gap-1 text-muted text-xs mt-0.5">
                    <MapPin size={10} />{c.area}
                    {!hasPinData && <span className="text-warning ml-1">· no pin</span>}
                  </div>
                  <p className="text-xs font-semibold text-navy mt-1">{c.priceLabel}</p>
                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <Link
                      to={`/communities/${c.slug}`}
                      onClick={e => e.stopPropagation()}
                      className="text-xs font-semibold text-teal hover:underline flex items-center gap-0.5"
                    >
                      Details <ArrowRight size={11} />
                    </Link>
                    <button
                      onClick={e => { e.stopPropagation(); toggleFavorite(c.id); showToast(fav ? 'Removed' : 'Saved'); }}
                      aria-label={fav ? 'Unsave' : 'Save'}
                      className={`p-1 rounded transition-colors ${fav ? 'text-coral' : 'text-muted hover:text-coral'}`}
                    >
                      <Heart size={12} fill={fav ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={e => handleCompare(e, c.id)}
                      aria-label={inComp ? 'Remove from compare' : 'Compare'}
                      className={`p-1 rounded transition-colors ${inComp ? 'text-teal' : 'text-muted hover:text-teal'}`}
                    >
                      <Scale size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map panel */}
      <div className="flex-1 relative min-h-[320px] lg:min-h-0">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-sand-light">
            <div className="text-center text-muted">
              <MapPin size={32} className="mx-auto mb-2 animate-pulse text-teal" />
              <p className="text-sm">Loading map…</p>
            </div>
          </div>
        }>
          <CommunityMap
            communities={communities}
            selectedId={selectedId}
            onSelect={id => setSelectedId(prev => prev === id ? null : id)}
            height="100%"
          />
        </Suspense>

        {/* Selected community card overlay */}
        {selectedCommunity && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-72 bg-white rounded-xl shadow-xl border border-border p-4">
            <button
              onClick={() => setSelectedId(null)}
              className="absolute top-2 right-2 text-muted hover:text-primary text-lg leading-none"
              aria-label="Close"
            >×</button>
            <StatusBadge status={selectedCommunity.status} />
            <p className="font-semibold text-primary mt-1 text-sm">{selectedCommunity.name}</p>
            <p className="text-xs text-muted">{selectedCommunity.builderName} · {selectedCommunity.area}</p>
            <p className="text-sm font-bold text-navy mt-1">{selectedCommunity.priceLabel}</p>
            <Link
              to={`/communities/${selectedCommunity.slug}`}
              className="mt-3 btn-teal w-full justify-center text-xs py-2"
            >
              View Community <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
