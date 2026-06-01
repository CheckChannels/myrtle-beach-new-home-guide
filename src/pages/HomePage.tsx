import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Building2, MapPin, Home, ArrowRight, CheckCircle, ChevronDown, ChevronUp, Scale, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateMarketStats, getPriceRange, getCommunitiesByArea } from '../utils/stats';
import { StatCard } from '../components/ui/StatCard';
import { CommunityCard } from '../components/cards/CommunityCard';
import { BuilderCard } from '../components/cards/BuilderCard';
import { AreaCard } from '../components/cards/AreaCard';
import { formatPriceShort } from '../utils/format';
import { areas as areaData } from '../data/sampleData';
import { useEffect } from 'react';
import { setPageMeta } from '../utils/seo';

const QUICK_FILTERS = [
  { label: 'Under $300k', query: 'maxPrice=300000' },
  { label: 'Under Construction', query: 'status=Under+Construction' },
  { label: 'Future Subdivisions', to: '/future-subdivisions' },
  { label: 'Myrtle Beach', query: 'area=Myrtle+Beach' },
  { label: 'Conway', query: 'area=Conway' },
  { label: 'Carolina Forest', query: 'area=Carolina+Forest' },
  { label: '55+ / Active Adult', query: 'propertyType=Active+adult' },
  { label: 'Townhomes', query: 'propertyType=Townhome' },
  { label: 'Luxury', query: 'propertyType=Luxury' },
];

const FAQS = [
  { q: 'Are prices guaranteed?', a: 'No. All pricing on this site is estimated from publicly available or self-reported builder information and should be independently verified. Prices, incentives, and availability change frequently.' },
  { q: 'Which Myrtle Beach areas have the most new construction?', a: 'Conway, Carolina Forest, Longs, and North Myrtle Beach are currently among the most active new construction corridors in the Grand Strand area.' },
  { q: 'Can I compare builders?', a: 'Yes — use the Compare tool to select up to 4 communities and view them side by side. You can access the compare page from any community card.' },
  { q: 'What does Future Subdivision mean?', a: 'Future subdivisions are planned or early-stage communities where details such as builder assignment, pricing, floor plans, and development timelines have not yet been confirmed.' },
  { q: 'How often is the guide updated?', a: 'We aim to update community information regularly, but this is an informational guide — not a live MLS feed. Always verify current availability and pricing directly with the builder.' },
  { q: 'Should I verify incentives and availability with the builder?', a: 'Yes, absolutely. Builder incentives, quick move-in availability, lot premiums, and upgrade pricing change frequently and should be confirmed directly with the builder or their sales representative.' },
  { q: 'Can I search by quick move-in homes?', a: 'You can filter for communities that have reported quick move-in availability using the Communities filter panel. Availability is subject to change — verify with the builder.' },
  { q: 'Are completed communities still useful to browse?', a: 'Yes. Completed communities can help you understand builder history and neighborhood context. Resale inventory from completed communities may also become available over time.' },
];

export function HomePage() {
  const { communities, builders } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setPageMeta({
      title: 'Myrtle Beach New Home Builders & Communities | New Construction Guide',
      description: 'Compare Myrtle Beach new home builders, communities, prices, areas, and construction status across the Grand Strand.',
    });
  }, []);

  const stats = calculateMarketStats(communities, builders);
  const { min: lowestPrice } = getPriceRange(communities);
  const featured = communities.filter(c => c.status === 'Under Construction').slice(0, 6);
  const spotlightBuilders = builders.filter(b => b.builderType !== 'unknown').slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/communities?q=${encodeURIComponent(query.trim())}`);
  };

  const handleQuickFilter = (f: typeof QUICK_FILTERS[0]) => {
    if (f.to) navigate(f.to);
    else navigate(`/communities?${f.query}`);
  };

  const displayAreas = areaData.slice(0, 12).map(a => ({
    area: a,
    communities: getCommunitiesByArea(communities, a.name),
  }));

  return (
    <div className="pb-20 lg:pb-0">
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 30% 50%, #0E7C7B 0%, transparent 60%), radial-gradient(circle at 70% 30%, #D96C4A 0%, transparent 50%)'}} />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <p className="text-teal-light/80 font-semibold text-sm tracking-widest uppercase mb-4">Grand Strand New Construction Directory</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5 max-w-3xl">
            Compare Myrtle Beach New Home Builders & Communities
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mb-8 leading-relaxed">
            Search new home communities by builder, area, price, and status across Myrtle Beach, Conway, Carolina Forest, Longs, Murrells Inlet, Little River, North Myrtle Beach, and the Grand Strand.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mb-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search builder, community, city, area, or status…"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal backdrop-blur-sm text-sm"
              />
            </div>
            <button type="submit" className="btn-primary px-6 py-3.5 rounded-xl shrink-0">Search</button>
          </form>

          {/* Quick filters */}
          <div className="flex flex-wrap gap-2">
            {QUICK_FILTERS.map(f => (
              <button key={f.label} onClick={() => handleQuickFilter(f)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white/80 hover:bg-teal hover:text-white border border-white/20 transition-all">
                {f.label}
              </button>
            ))}
          </div>

          <p className="text-white/40 text-xs mt-4">Independent guide. Pricing and availability are estimates — verify with builder.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard icon={Home} label="Communities" value={stats.totalCommunities} />
            <StatCard icon={Building2} label="Active Builders" value={stats.activeBuilders} />
            <StatCard icon={TrendingUp} label="Under Construction" value={stats.underConstruction} />
            <StatCard icon={Clock} label="Future Subdivisions" value={stats.futureSubdivisions} />
            <StatCard icon={CheckCircle} label="Recently Completed" value={stats.recentlyCompleted} />
            <StatCard icon={Scale} label="Starting From" value={lowestPrice ? formatPriceShort(lowestPrice) : 'Varies'} sub="Estimated" />
          </div>
        </div>
      </section>

      {/* Browse modules */}
      <section className="section bg-bg">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-primary mb-2">Browse the Directory</h2>
          <p className="text-muted mb-8">Find new home communities by builder, area, status, and more.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { to: '/builders', icon: Building2, label: 'By Builder', desc: `${builders.filter(b=>b.builderType!=='unknown').length} builders` },
              { to: '/communities', icon: Home, label: 'All Communities', desc: `${communities.length} communities` },
              { to: '/areas', icon: MapPin, label: 'By Area', desc: '18 areas' },
              { to: '/future-subdivisions', icon: Clock, label: 'Future Subdivisions', desc: `${stats.futureSubdivisions} planned` },
              { to: '/recently-completed', icon: CheckCircle, label: 'Recently Completed', desc: `${stats.recentlyCompleted} communities` },
              { to: '/resources', icon: Scale, label: 'Buyer Resources', desc: '7 guides' },
            ].map(m => (
              <Link key={m.to} to={m.to} className="card p-5 hover:shadow-md transition-all group flex flex-col items-start">
                <div className="p-2.5 bg-teal-light rounded-lg mb-3"><m.icon size={20} className="text-teal" /></div>
                <h3 className="font-semibold text-primary group-hover:text-teal transition-colors text-sm">{m.label}</h3>
                <p className="text-xs text-muted mt-0.5">{m.desc}</p>
                <ArrowRight size={14} className="text-teal mt-3" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Builder Spotlight */}
      <section className="section bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary">Builder Spotlight</h2>
              <p className="text-muted text-sm mt-1">Active builders in the Myrtle Beach area</p>
            </div>
            <Link to="/builders" className="text-sm font-semibold text-teal hover:text-teal-dark flex items-center gap-1">
              All Builders <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {spotlightBuilders.map(b => (
              <BuilderCard key={b.id} builder={b} communities={communities.filter(c => c.builderId === b.id)} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Communities */}
      <section className="section bg-bg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary">Active Communities</h2>
              <p className="text-muted text-sm mt-1">Currently under construction across the Grand Strand</p>
            </div>
            <Link to="/communities" className="text-sm font-semibold text-teal hover:text-teal-dark flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map(c => <CommunityCard key={c.id} community={c} />)}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="section bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-primary">Explore by Area</h2>
              <p className="text-muted text-sm mt-1">New construction communities by Grand Strand location</p>
            </div>
            <Link to="/areas" className="text-sm font-semibold text-teal hover:text-teal-dark flex items-center gap-1">
              All Areas <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayAreas.map(({ area, communities: ac }) => (
              <AreaCard key={area.id} area={area} communities={ac} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section bg-navy">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-white mb-3">How This Guide Works</h2>
          <p className="text-white/60 mb-10 max-w-xl">An independent-style directory to help you research new construction — not a builder site, not an MLS.</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { n: '1', title: 'Search Communities', desc: 'Use filters to browse by builder, area, price range, property type, amenities, and construction status.' },
              { n: '2', title: 'Compare Builders', desc: 'View side-by-side comparisons of communities, pricing, amenities, and builder profiles. Save favorites.' },
              { n: '3', title: 'Request Local Guidance', desc: 'Contact us to verify current availability, pricing, and incentives with local real estate professionals.' },
            ].map(s => (
              <div key={s.n} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-teal/20 text-teal flex items-center justify-center font-bold text-lg shrink-0">{s.n}</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{s.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/40 text-xs mt-8">All pricing is estimated from publicly available information. Verify all details with the builder before making any purchasing decisions.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-teal-light">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-2xl font-bold text-primary mb-3">Need help narrowing down Myrtle Beach new construction?</h2>
          <p className="text-muted mb-6">Tell us your target area, budget, timeline, and preferred builder style. We'll help you compare communities and verify current availability.</p>
          <Link to="/contact" className="btn-primary inline-flex text-base px-8 py-3.5">
            Get Local New Home Guidance <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-primary mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-semibold text-primary pr-4">{f.q}</span>
                  {openFaq === i ? <ChevronUp size={18} className="text-teal shrink-0" /> : <ChevronDown size={18} className="text-muted shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-muted leading-relaxed border-t border-border pt-4">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
