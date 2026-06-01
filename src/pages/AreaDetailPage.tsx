import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Building2, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommunityCard } from '../components/cards/CommunityCard';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { areas as areaData } from '../data/sampleData';
import { getCommunitiesByArea, getPriceRange, getStatusCounts } from '../utils/stats';
import { formatPriceShort } from '../utils/format';
import { setPageMeta } from '../utils/seo';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function AreaDetailPage() {
  const { areaSlug } = useParams<{ areaSlug: string }>();
  const { communities, builders } = useApp();
  const navigate = useNavigate();

  const area = areaData.find(a => a.slug === areaSlug);
  const areaCommunities = area ? getCommunitiesByArea(communities, area.name) : [];
  const { min, max } = getPriceRange(areaCommunities);
  const counts = getStatusCounts(areaCommunities);
  const areaBuilders = [...new Set(areaCommunities.map(c => c.builderId))].map(id => builders.find(b => b.id === id)).filter(Boolean);

  useEffect(() => {
    if (area) setPageMeta({ title: `New Homes in ${area.name} SC | New Construction Communities`, description: `Browse new home communities in ${area.name}. ${area.description}` });
  }, [area]);

  if (!area) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-primary mb-4">Area Not Found</h1>
      <Button onClick={() => navigate('/areas')}>Browse All Areas</Button>
    </div>
  );

  return (
    <div className="pb-20 lg:pb-0">
      <div className="bg-navy">
        <div className="container mx-auto px-4 py-10">
          <Breadcrumbs crumbs={[{ label: 'Areas', to: '/areas' }, { label: area.name }]} />
          <div className="flex items-start gap-4 mt-5">
            <div className="p-3 bg-teal/20 rounded-xl"><MapPin size={24} className="text-teal-light" /></div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">New Homes in {area.name}</h1>
              <p className="text-white/70 max-w-2xl">{area.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-wrap gap-6 text-sm">
            <Stat icon={Home} label="Communities" value={areaCommunities.length} />
            <Stat icon={Building2} label="Builders" value={areaBuilders.length} />
            {min && <Stat icon={MapPin} label="Starting From" value={formatPriceShort(min)} />}
            {max && max !== min && <Stat icon={MapPin} label="Up To" value={formatPriceShort(max)} />}
            <Stat icon={Home} label="Under Construction" value={counts['Under Construction'] || 0} />
            <Stat icon={Home} label="Future" value={(counts['Future Subdivision'] || 0) + (counts['Coming Soon'] || 0)} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {areaCommunities.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <MapPin size={40} className="mx-auto mb-4 text-muted/40" />
            <p className="font-semibold text-primary mb-2">No communities listed yet for {area.name}</p>
            <p className="text-sm">This area may have future communities in development. Check back soon.</p>
            <Link to="/communities" className="btn-primary inline-flex mt-6">Browse All Communities</Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-primary mb-5">{areaCommunities.length} Communities in {area.name}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {areaCommunities.map(c => <CommunityCard key={c.id} community={c} />)}
            </div>
          </>
        )}

        {/* Active builders in area */}
        {areaBuilders.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-primary mb-4">Builders Active in {area.name}</h2>
            <div className="flex flex-wrap gap-3">
              {areaBuilders.map(b => b && (
                <Link key={b.id} to={`/builders/${b.slug}`} className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium hover:border-teal hover:text-teal transition-colors">
                  {b.name} <ArrowRight size={13} />
                </Link>
              ))}
            </div>
          </div>
        )}

        {area.nearbyAreas.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-primary mb-3">Nearby Areas</h3>
            <div className="flex flex-wrap gap-2">
              {area.nearbyAreas.map(n => {
                const slug = n.toLowerCase().replace(/\s+/g, '-');
                return <Link key={n} to={`/areas/${slug}`} className="px-3 py-1.5 bg-sand-light text-primary rounded-full text-sm hover:bg-teal-light hover:text-teal transition-colors">{n}</Link>;
              })}
            </div>
          </div>
        )}
        <p className="text-xs text-muted mt-8 text-center">Pricing and availability are estimates. Verify with the builder.</p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-teal" />
      <span className="font-bold text-primary">{value}</span>
      <span className="text-muted">{label}</span>
    </div>
  );
}
