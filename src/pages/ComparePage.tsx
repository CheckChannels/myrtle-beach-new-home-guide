import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, ArrowRight, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/Badge';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { setPageMeta } from '../utils/seo';

export function ComparePage() {
  const { communities, comparison, removeFromComparison } = useApp();
  const selected = comparison.map(id => communities.find(c => c.id === id)).filter(Boolean) as typeof communities;

  useEffect(() => { setPageMeta({ title: 'Compare Myrtle Beach New Home Communities', description: 'Compare up to 4 new home communities side by side.' }); }, []);

  const fields = [
    { label: 'Builder', get: (c: typeof communities[0]) => c.builderName },
    { label: 'Area', get: (c: typeof communities[0]) => `${c.area}, ${c.state}` },
    { label: 'Starting Price', get: (c: typeof communities[0]) => c.priceLabel },
    { label: 'Status', get: (c: typeof communities[0]) => <StatusBadge status={c.status} /> },
    { label: 'Property Types', get: (c: typeof communities[0]) => c.propertyTypes.join(', ') || '—' },
    { label: 'Bedrooms', get: (c: typeof communities[0]) => c.minBeds ? `${c.minBeds}${c.maxBeds && c.maxBeds !== c.minBeds ? `–${c.maxBeds}` : ''}` : '—' },
    { label: 'Bathrooms', get: (c: typeof communities[0]) => c.minBaths ? `${c.minBaths}${c.maxBaths && c.maxBaths !== c.minBaths ? `–${c.maxBaths}` : ''}` : '—' },
    { label: 'Sq Ft Range', get: (c: typeof communities[0]) => c.minSqft ? `${c.minSqft.toLocaleString()}${c.maxSqft && c.maxSqft !== c.minSqft ? `–${c.maxSqft.toLocaleString()}` : ''} sqft` : '—' },
    { label: 'Garage', get: (c: typeof communities[0]) => c.garages || '—' },
    { label: 'Amenities', get: (c: typeof communities[0]) => (
      <div className="flex flex-wrap gap-1">
        {c.amenities.slice(0, 5).map(a => <span key={a} className="badge bg-teal-light text-teal-dark text-xs">{a}</span>)}
        {c.amenities.length > 5 && <span className="text-xs text-muted">+{c.amenities.length - 5}</span>}
      </div>
    )},
    { label: 'Last Verified', get: (c: typeof communities[0]) => c.lastVerified },
    { label: 'Data Confidence', get: (c: typeof communities[0]) => c.dataConfidence },
  ];

  return (
    <div className="pb-20 lg:pb-0">
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs crumbs={[{ label: 'Compare' }]} />
          <div className="flex items-center gap-3 mt-3">
            <Scale size={24} className="text-teal" />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Compare Communities</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {selected.length === 0 ? (
          <div className="text-center py-20">
            <Scale size={48} className="mx-auto mb-4 text-muted/40" />
            <h2 className="text-xl font-bold text-primary mb-3">No communities selected for comparison</h2>
            <p className="text-muted mb-6">Add communities from the directory to compare them side by side. You can compare up to 4 at a time.</p>
            <Link to="/communities" className="btn-primary inline-flex">Browse Communities <ArrowRight size={14} /></Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted">Comparing {selected.length} of 4 communities</p>
              <Link to="/communities" className="text-sm text-teal hover:underline">+ Add more</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="w-32 p-3 border border-border bg-bg text-left font-semibold text-primary text-xs">Field</th>
                    {selected.map(c => (
                      <th key={c.id} className="p-3 border border-border bg-bg min-w-[200px]">
                        <div className="relative">
                          <button onClick={() => removeFromComparison(c.id)} aria-label={`Remove ${c.name}`}
                            className="absolute -top-1 -right-1 p-1 rounded-full bg-error/10 text-error hover:bg-error hover:text-white transition-colors">
                            <X size={12} />
                          </button>
                          <div className="w-full h-24 bg-sand-light rounded-lg overflow-hidden mb-2">
                            <img src={c.imageUrls[0]} alt={c.name} className="w-full h-full object-cover" />
                          </div>
                          <Link to={`/communities/${c.slug}`} className="font-semibold text-primary hover:text-teal text-sm block text-left">{c.name}</Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fields.map(f => (
                    <tr key={f.label} className="even:bg-bg/50">
                      <td className="p-3 border border-border font-medium text-primary text-xs whitespace-nowrap">{f.label}</td>
                      {selected.map(c => (
                        <td key={c.id} className="p-3 border border-border text-muted">{f.get(c)}</td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-3 border border-border" />
                    {selected.map(c => (
                      <td key={c.id} className="p-3 border border-border">
                        <Link to={`/communities/${c.slug}`} className="btn-teal text-xs px-3 py-2 w-full justify-center">
                          View Details <ArrowRight size={12} />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 bg-sand-light rounded-xl p-4 flex items-start gap-2 text-sm text-muted">
              <CheckCircle size={15} className="text-teal shrink-0 mt-0.5" />
              Pricing and availability are estimates. Verify all details with the builder before making any purchasing decisions.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
