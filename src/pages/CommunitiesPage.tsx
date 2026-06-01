import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, LayoutGrid, List, Map } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommunityCard } from '../components/cards/CommunityCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { filterCommunities, sortCommunities, defaultFilters } from '../utils/filters';
import { CommunityFilters, SortOption, CommunityStatus } from '../types';
import { setPageMeta } from '../utils/seo';

const MapListView = lazy(() =>
  import('../components/map/MapListView').then(m => ({ default: m.MapListView }))
);
import { siteConfig } from '../config/siteConfig';
import { Button } from '../components/ui/Button';

const STATUSES: CommunityStatus[] = ['Under Construction','Future Subdivision','Coming Soon','Recently Completed','Completed','Leasing','Sold Out'];
const PROPERTY_TYPES = ['Single-family','Townhome','Condo','Villa','Active adult','Luxury','Custom','Rental/leasing'];
const AMENITIES = ['Pool','Clubhouse','Golf course','Intracoastal Waterway','Gated','Beach access','Trails','Natural gas','Low-maintenance','55+','Smart home'];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'builder-az', label: 'Builder A–Z' },
  { value: 'area-az', label: 'Area A–Z' },
  { value: 'newest', label: 'Newest Updated' },
];

export function CommunitiesPage() {
  const { communities, builders } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<CommunityFilters>(() => ({
    ...defaultFilters,
    keyword: searchParams.get('q') || '',
    areas: searchParams.get('area') ? [searchParams.get('area')!] : [],
    statuses: searchParams.get('status') ? [searchParams.get('status') as CommunityStatus] : [],
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null,
    propertyTypes: searchParams.get('propertyType') ? [searchParams.get('propertyType')!] : [],
  }));
  const [sort, setSort] = useState<SortOption>('recommended');
  const [view, setView] = useState<'grid' | 'table' | 'map'>('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageMeta({ title: 'New Home Communities in Myrtle Beach & the Grand Strand', description: 'Search all new home communities in Myrtle Beach, Conway, Carolina Forest, Longs, and the Grand Strand. Filter by builder, area, price, status, and more.' });
    setTimeout(() => setLoading(false), 400);
  }, []);

  const filtered = useMemo(() => sortCommunities(filterCommunities(communities, filters), sort), [communities, filters, sort]);

  const setFilter = <K extends keyof CommunityFilters>(k: K, v: CommunityFilters[K]) => setFilters(f => ({ ...f, [k]: v }));
  const toggleArr = <K extends keyof CommunityFilters>(k: K, val: string) => {
    const arr = filters[k] as string[];
    setFilter(k, (arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]) as CommunityFilters[K]);
  };
  const resetFilters = () => setFilters(defaultFilters);
  const activeFilterCount = [filters.keyword, ...filters.areas, ...filters.builders, ...filters.statuses, ...filters.propertyTypes, ...filters.amenities].filter(Boolean).length + (filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0);

  const FilterPanel = () => (
    <div className="space-y-5 text-sm">
      {/* Keyword */}
      <div>
        <label className="block font-semibold text-primary mb-2">Search</label>
        <input value={filters.keyword} onChange={e => setFilter('keyword', e.target.value)}
          placeholder="Builder, community, city…"
          className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
      </div>
      {/* Area */}
      <div>
        <label className="block font-semibold text-primary mb-2">Area / City</label>
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {siteConfig.areas.map(a => (
            <label key={a} className="flex items-center gap-2 cursor-pointer hover:text-teal">
              <input type="checkbox" checked={filters.areas.includes(a)} onChange={() => toggleArr('areas', a)} className="rounded text-teal" />
              {a}
            </label>
          ))}
        </div>
      </div>
      {/* Status */}
      <div>
        <label className="block font-semibold text-primary mb-2">Status</label>
        <div className="space-y-1.5">
          {STATUSES.map(s => (
            <label key={s} className="flex items-center gap-2 cursor-pointer hover:text-teal">
              <input type="checkbox" checked={filters.statuses.includes(s)} onChange={() => toggleArr('statuses', s)} className="rounded text-teal" />
              {s}
            </label>
          ))}
        </div>
      </div>
      {/* Price */}
      <div>
        <label className="block font-semibold text-primary mb-2">Price Range</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder="Min $" value={filters.minPrice ?? ''} onChange={e => setFilter('minPrice', e.target.value ? Number(e.target.value) : null)}
            className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
          <input type="number" placeholder="Max $" value={filters.maxPrice ?? ''} onChange={e => setFilter('maxPrice', e.target.value ? Number(e.target.value) : null)}
            className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal" />
        </div>
      </div>
      {/* Property Types */}
      <div>
        <label className="block font-semibold text-primary mb-2">Property Type</label>
        <div className="space-y-1.5">
          {PROPERTY_TYPES.map(t => (
            <label key={t} className="flex items-center gap-2 cursor-pointer hover:text-teal">
              <input type="checkbox" checked={filters.propertyTypes.includes(t)} onChange={() => toggleArr('propertyTypes', t)} className="rounded text-teal" />
              {t}
            </label>
          ))}
        </div>
      </div>
      {/* Amenities */}
      <div>
        <label className="block font-semibold text-primary mb-2">Amenities</label>
        <div className="space-y-1.5">
          {AMENITIES.map(a => (
            <label key={a} className="flex items-center gap-2 cursor-pointer hover:text-teal">
              <input type="checkbox" checked={filters.amenities.includes(a)} onChange={() => toggleArr('amenities', a)} className="rounded text-teal" />
              {a}
            </label>
          ))}
        </div>
      </div>
      {/* Toggles */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={filters.quickMoveIn} onChange={e => setFilter('quickMoveIn', e.target.checked)} className="rounded text-teal" />
          Quick Move-In Available
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={filters.hideFuture} onChange={e => setFilter('hideFuture', e.target.checked)} className="rounded text-teal" />
          Hide Future Subdivisions
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={filters.hideCompleted} onChange={e => setFilter('hideCompleted', e.target.checked)} className="rounded text-teal" />
          Hide Completed
        </label>
      </div>
      {activeFilterCount > 0 && (
        <Button variant="secondary" size="sm" onClick={resetFilters} className="w-full">
          <X size={14} /> Reset Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="pb-20 lg:pb-0">
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs crumbs={[{ label: 'Communities' }]} />
          <h1 className="text-2xl md:text-3xl font-bold text-primary mt-3">New Home Communities in Myrtle Beach & the Grand Strand</h1>
          <p className="text-muted mt-1 text-sm">Search and filter new construction communities across the Grand Strand.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="card p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-primary">Filters</h2>
                {activeFilterCount > 0 && <span className="badge bg-coral-light text-coral text-xs">{activeFilterCount}</span>}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <button onClick={() => setDrawerOpen(true)} className="lg:hidden flex items-center gap-2 text-sm font-medium text-primary border border-border rounded-lg px-3 py-2 hover:bg-sand-light transition-colors">
                  <SlidersHorizontal size={16} /> Filters {activeFilterCount > 0 && <span className="badge bg-coral-light text-coral text-xs ml-1">{activeFilterCount}</span>}
                </button>
                <p className="text-sm text-muted">
                  Showing <strong className="text-primary">{filtered.length}</strong> of {communities.length} communities
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select value={sort} onChange={e => setSort(e.target.value as SortOption)}
                  className="border border-border rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-teal">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <button onClick={() => setView('grid')} aria-label="Grid view" className={`p-2 transition-colors ${view === 'grid' ? 'bg-teal text-white' : 'text-muted hover:bg-sand-light'}`}><LayoutGrid size={16} /></button>
                  <button onClick={() => setView('table')} aria-label="List view" className={`p-2 transition-colors ${view === 'table' ? 'bg-teal text-white' : 'text-muted hover:bg-sand-light'}`}><List size={16} /></button>
                  <button onClick={() => setView('map')} aria-label="Map view" className={`p-2 transition-colors ${view === 'map' ? 'bg-teal text-white' : 'text-muted hover:bg-sand-light'}`}><Map size={16} /></button>
                </div>
              </div>
            </div>

            {/* Active chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.keyword && <Chip label={`"${filters.keyword}"`} onRemove={() => setFilter('keyword', '')} />}
                {filters.areas.map(a => <Chip key={a} label={a} onRemove={() => toggleArr('areas', a)} />)}
                {filters.statuses.map(s => <Chip key={s} label={s} onRemove={() => toggleArr('statuses', s)} />)}
                {filters.propertyTypes.map(t => <Chip key={t} label={t} onRemove={() => toggleArr('propertyTypes', t)} />)}
                {filters.minPrice && <Chip label={`Min $${filters.minPrice.toLocaleString()}`} onRemove={() => setFilter('minPrice', null)} />}
                {filters.maxPrice && <Chip label={`Max $${filters.maxPrice.toLocaleString()}`} onRemove={() => setFilter('maxPrice', null)} />}
              </div>
            )}

            {/* Results */}
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({length: 6}).map((_,i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState onReset={resetFilters} />
            ) : view === 'map' ? (
              <Suspense fallback={<div className="h-[560px] bg-sand-light rounded-xl animate-pulse flex items-center justify-center text-muted text-sm">Loading map…</div>}>
                <MapListView communities={filtered} />
              </Suspense>
            ) : view === 'grid' ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map(c => <CommunityCard key={c.id} community={c} />)}
              </div>
            ) : (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-bg border-b border-border sticky top-0">
                      <tr>
                        {['Community','Builder','Price','Area','Status','Type','Verified'].map(h => (
                          <th key={h} className="px-4 py-3 text-left font-semibold text-primary whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(c => (
                        <tr key={c.id} className="border-b border-border hover:bg-sand-light/50 transition-colors">
                          <td className="px-4 py-3"><a href={`/communities/${c.slug}`} className="font-medium text-teal hover:underline">{c.name}</a></td>
                          <td className="px-4 py-3 text-muted whitespace-nowrap">{c.builderName}</td>
                          <td className="px-4 py-3 font-medium text-navy whitespace-nowrap">{c.priceLabel}</td>
                          <td className="px-4 py-3 text-muted whitespace-nowrap">{c.area}</td>
                          <td className="px-4 py-3"><span className="badge bg-teal-light text-teal-dark text-xs">{c.status}</span></td>
                          <td className="px-4 py-3 text-muted">{c.propertyTypes[0] || '—'}</td>
                          <td className="px-4 py-3 text-muted text-xs whitespace-nowrap">{c.lastVerified}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-white">
              <h2 className="font-semibold text-primary">Filters</h2>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close filters"><X size={20} /></button>
            </div>
            <div className="p-4"><FilterPanel /></div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pb-6">
        <p className="text-xs text-muted mt-4 text-center">Pricing and availability are estimates. Verify directly with the builder.</p>
      </div>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1 px-3 py-1 bg-teal-light text-teal-dark text-xs font-medium rounded-full">
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label} filter`} className="hover:text-red-500 transition-colors"><X size={12} /></button>
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="bg-sand h-40 w-full" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-sand rounded w-1/3" />
        <div className="h-4 bg-sand rounded w-2/3" />
        <div className="h-3 bg-sand rounded w-1/2" />
      </div>
    </div>
  );
}
