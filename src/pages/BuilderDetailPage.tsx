import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Building2, MapPin, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommunityCard } from '../components/cards/CommunityCard';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { StatusBadge, Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { InquiryForm } from '../components/detail/InquiryForm';
import { getPriceRange, getStatusCounts } from '../utils/stats';
import { formatPriceShort } from '../utils/format';
import { setPageMeta } from '../utils/seo';

export function BuilderDetailPage() {
  const { builderSlug } = useParams<{ builderSlug: string }>();
  const { builders, communities } = useApp();
  const navigate = useNavigate();

  const builder = builders.find(b => b.slug === builderSlug);
  const builderCommunities = communities.filter(c => c.builderId === builder?.id);
  const { min, max } = getPriceRange(builderCommunities);
  const counts = getStatusCounts(builderCommunities);

  useEffect(() => {
    if (builder) setPageMeta({ title: `${builder.name} New Homes in Myrtle Beach | Communities & Pricing`, description: `${builder.name} new home communities in Myrtle Beach and the Grand Strand. ${builder.description}` });
  }, [builder]);

  if (!builder) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-primary mb-4">Builder Not Found</h1>
      <Button onClick={() => navigate('/builders')}>Browse All Builders</Button>
    </div>
  );

  const initials = builder.name.split(/\s+/).slice(0,2).map(w => w[0]).join('').toUpperCase();

  return (
    <div className="pb-20 lg:pb-0">
      {/* Hero */}
      <div className="bg-navy">
        <div className="container mx-auto px-4 py-12">
          <Breadcrumbs crumbs={[{ label: 'Builders', to: '/builders' }, { label: builder.name }]} />
          <div className="flex flex-col sm:flex-row items-start gap-6 mt-6">
            <div className="w-16 h-16 rounded-xl bg-white/10 text-white flex items-center justify-center text-2xl font-bold shrink-0">
              {initials || <Building2 size={28} />}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{builder.name}</h1>
              <p className="text-white/70 max-w-2xl mb-4">{builder.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {builder.specialties.map(s => <Badge key={s} variant="teal">{s}</Badge>)}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                <span>{builderCommunities.length} communities</span>
                {min && <span>{formatPriceShort(min)}{max && max !== min ? ` – ${formatPriceShort(max)}` : ''}</span>}
                {builder.areasServed.length > 0 && (
                  <span className="flex items-center gap-1"><MapPin size={13} />{builder.areasServed.join(', ')}</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link to="/contact" className="btn-primary">Ask About This Builder</Link>
              <Link to="/compare" className="btn-secondary text-white border-white/30 hover:bg-white/10">Compare</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-wrap gap-6 text-sm">
            {Object.entries(counts).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2">
                <StatusBadge status={status as any} />
                <span className="font-bold text-primary">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-primary mb-5">{builder.name} Communities</h2>
            {builderCommunities.length === 0 ? (
              <p className="text-muted">No communities listed yet for this builder.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                {builderCommunities.map(c => <CommunityCard key={c.id} community={c} />)}
              </div>
            )}

            {/* Related builders */}
            <div className="mt-10">
              <h2 className="text-xl font-bold text-primary mb-4">Other Builders</h2>
              <div className="flex flex-wrap gap-3">
                {builders.filter(b => b.id !== builder.id && b.builderType !== 'unknown').slice(0, 8).map(b => (
                  <Link key={b.id} to={`/builders/${b.slug}`} className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium text-primary hover:border-teal hover:text-teal transition-colors">
                    {b.name} <ArrowRight size={13} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="card p-6">
              <h2 className="font-bold text-primary text-lg mb-4">Request Builder Info</h2>
              <InquiryForm builderId={builder.id} communityName={`${builder.name} communities`} />
            </div>
          </div>
        </div>
        <p className="text-xs text-muted mt-8 text-center">Pricing and availability are estimates. Verify with the builder.</p>
      </div>
    </div>
  );
}
