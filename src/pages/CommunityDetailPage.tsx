import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Home, Building2, CheckCircle, AlertCircle, Heart, Scale, ArrowRight, Bed, Bath, Maximize2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/Badge';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { InquiryForm } from '../components/detail/InquiryForm';
import { CommunityCard } from '../components/cards/CommunityCard';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { setPageMeta } from '../utils/seo';
import { getBedBathLabel, getSqftLabel } from '../utils/format';

export function CommunityDetailPage() {
  const { communitySlug } = useParams<{ communitySlug: string }>();
  const { communities, builders, isFavorite, toggleFavorite, addToComparison, isInComparison, removeFromComparison } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const community = communities.find(c => c.slug === communitySlug);
  const builder = community ? builders.find(b => b.id === community.builderId) : null;

  useEffect(() => {
    if (community) {
      setPageMeta({
        title: `${community.name} | ${community.builderName} | ${community.area} New Homes`,
        description: `${community.name} by ${community.builderName} in ${community.area}, SC. ${community.priceLabel}. ${community.status}.`,
      });
    }
  }, [community]);

  if (!community) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-primary mb-4">Community Not Found</h1>
        <p className="text-muted mb-6">This community may have been removed or the URL may be incorrect.</p>
        <Button onClick={() => navigate('/communities')}>Browse All Communities</Button>
      </div>
    );
  }

  const fav = isFavorite(community.id);
  const inComp = isInComparison(community.id);
  const img = community.imageUrls[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80';

  const related = communities.filter(c => c.id !== community.id && (c.builderId === community.builderId || c.area === community.area)).slice(0, 3);

  const handleCompare = () => {
    if (inComp) { removeFromComparison(community.id); showToast('Removed from comparison'); return; }
    const ok = addToComparison(community.id);
    if (ok) showToast('Added to comparison');
    else showToast('Max 4 communities for comparison', 'error');
  };

  return (
    <div className="pb-20 lg:pb-0">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={img} alt={community.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <StatusBadge status={community.status} />
            <h1 className="text-2xl md:text-4xl font-bold text-white mt-2 mb-1">{community.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-white/80 text-sm">
              <span className="flex items-center gap-1"><Building2 size={14} />{community.builderName}</span>
              <span className="flex items-center gap-1"><MapPin size={14} />{community.area}, {community.state}</span>
              <span className="font-semibold text-white">{community.priceLabel}</span>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => { toggleFavorite(community.id); showToast(fav ? 'Removed from saved' : 'Saved'); }}
            className={`p-2.5 rounded-full shadow-lg transition-all ${fav ? 'bg-coral text-white' : 'bg-white/90 text-muted hover:text-coral'}`}
            aria-label={fav ? 'Remove from saved' : 'Save community'}>
            <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
          </button>
          <button onClick={handleCompare}
            className={`p-2.5 rounded-full shadow-lg transition-all ${inComp ? 'bg-teal text-white' : 'bg-white/90 text-muted hover:text-teal'}`}
            aria-label={inComp ? 'Remove from compare' : 'Add to compare'}>
            <Scale size={16} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Breadcrumbs crumbs={[{ label: 'Communities', to: '/communities' }, { label: community.name }]} />
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Facts */}
            <div className="card p-6">
              <h2 className="font-bold text-primary text-lg mb-4">Community Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Builder', value: community.builderName },
                  { label: 'Area', value: `${community.area}, ${community.state}` },
                  { label: 'Status', value: community.status },
                  { label: 'Starting Price', value: community.priceLabel },
                  community.minBeds && { label: 'Bedrooms', value: getBedBathLabel(community.minBeds, community.maxBeds) },
                  community.minBaths && { label: 'Bathrooms', value: getBedBathLabel(undefined, undefined, community.minBaths, community.maxBaths) },
                  community.minSqft && { label: 'Square Footage', value: getSqftLabel(community.minSqft, community.maxSqft) },
                  community.garages && { label: 'Garage', value: community.garages },
                  community.stories && { label: 'Stories', value: community.stories },
                  { label: 'Property Types', value: community.propertyTypes.join(', ') || '—' },
                  { label: 'Last Verified', value: community.lastVerified },
                  { label: 'Data Confidence', value: community.dataConfidence },
                ].filter(Boolean).map((item) => {
                  const { label, value } = item as { label: string; value: string };
                  return (
                    <div key={label}>
                      <p className="text-xs text-muted mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-primary">{value}</p>
                    </div>
                  );
                })}
              </div>
              {community.dataConfidence === 'Low' && (
                <div className="mt-4 flex items-start gap-2 bg-warning/10 text-amber-700 rounded-lg p-3 text-sm">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>This is a future or early-stage community. Details are preliminary and should be independently verified.</span>
                </div>
              )}
            </div>

            {/* Overview */}
            <div className="card p-6">
              <h2 className="font-bold text-primary text-lg mb-3">Overview</h2>
              <p className="text-muted leading-relaxed">{community.description}</p>
              {community.highlights.length > 0 && (
                <div className="mt-4 grid sm:grid-cols-2 gap-2">
                  {community.highlights.map(h => (
                    <div key={h} className="flex items-start gap-2 text-sm text-primary">
                      <CheckCircle size={14} className="text-teal shrink-0 mt-0.5" />{h}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Floor Plans */}
            <div className="card p-6">
              <h2 className="font-bold text-primary text-lg mb-4">Floor Plans</h2>
              {community.floorPlans.length === 0 ? (
                <div className="text-center py-8 text-muted">
                  <Home size={36} className="mx-auto mb-3 text-muted/40" />
                  <p className="text-sm">Floor plan details are not yet available.</p>
                  <p className="text-xs mt-1">Request updates for this community.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {community.floorPlans.map(fp => (
                    <div key={fp.id} className="border border-border rounded-lg p-4 hover:border-teal transition-colors">
                      <p className="font-semibold text-primary mb-2">{fp.name}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-muted mb-2">
                        {fp.beds && <span className="flex items-center gap-1"><Bed size={13} />{fp.beds} bd</span>}
                        {fp.baths && <span className="flex items-center gap-1"><Bath size={13} />{fp.baths} ba</span>}
                        {fp.sqft && <span className="flex items-center gap-1"><Maximize2 size={13} />{fp.sqft.toLocaleString()} sqft</span>}
                        {fp.stories && <span>{fp.stories} {fp.stories === 1 ? 'story' : 'stories'}</span>}
                      </div>
                      {fp.startingPrice && <p className="text-sm font-bold text-navy">From ${fp.startingPrice.toLocaleString()}</p>}
                      {fp.description && <p className="text-xs text-muted mt-2 leading-relaxed">{fp.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Amenities */}
            {community.amenities.length > 0 && (
              <div className="card p-6">
                <h2 className="font-bold text-primary text-lg mb-4">Amenities & Features</h2>
                <div className="flex flex-wrap gap-2">
                  {community.amenities.map(a => (
                    <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-light text-teal-dark rounded-full text-sm font-medium">
                      <CheckCircle size={12} />{a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="card p-6">
              <h2 className="font-bold text-primary text-lg mb-4">Location</h2>
              <div className="flex flex-wrap gap-4 text-sm text-muted mb-4">
                <span className="flex items-center gap-1"><MapPin size={14} />{community.address || `${community.area}, ${community.state}`}</span>
                <span className="flex items-center gap-1"><Calendar size={14} />Last verified: {community.lastVerified}</span>
              </div>
              <div className="bg-sand-light border border-border rounded-xl overflow-hidden h-48 flex items-center justify-center">
                <div className="text-center text-muted">
                  <MapPin size={32} className="mx-auto mb-2 text-muted/40" />
                  <p className="text-sm font-medium">Map — Approximate Location</p>
                  <p className="text-xs">{community.area}, SC</p>
                  <p className="text-xs text-muted/60 mt-1">Map positions are approximate. Verify address before visiting.</p>
                </div>
              </div>
            </div>

            {/* Builder */}
            {builder && (
              <div className="card p-6">
                <h2 className="font-bold text-primary text-lg mb-4">About {builder.name}</h2>
                <p className="text-muted text-sm mb-4">{builder.description}</p>
                <Link to={`/builders/${builder.slug}`} className="btn-secondary inline-flex">
                  View All {builder.name} Communities <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-sand-light border border-border rounded-xl p-4 text-xs text-muted leading-relaxed">
              <strong className="text-primary">Disclaimer:</strong> {community.disclaimer || 'Prices, availability, floor plans, incentives, amenities, and community status are estimates and may change without notice. Verify details directly with the builder, developer, listing agent, or appropriate local authority.'}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Inquiry form */}
            <div className="card p-6">
              <h2 className="font-bold text-primary text-lg mb-4">Ask About This Community</h2>
              <InquiryForm communityId={community.id} builderId={community.builderId} communityName={community.name} />
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-primary mb-6">Related Communities</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(c => <CommunityCard key={c.id} community={c} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
