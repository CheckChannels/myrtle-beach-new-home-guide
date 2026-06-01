import React, { useState, useMemo, useEffect } from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BuilderCard } from '../components/cards/BuilderCard';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { StatusBadge } from '../components/ui/Badge';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { setPageMeta } from '../utils/seo';

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function BuildersPage() {
  const { builders, communities } = useApp();
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  useEffect(() => {
    setPageMeta({ title: 'Myrtle Beach New Homes by Builder | Compare Builders & Communities', description: 'Browse new home builders active in Myrtle Beach and the Grand Strand. Compare communities, price ranges, and areas served.' });
  }, []);

  const filtered = useMemo(() => {
    let list = builders.filter(b => b.builderType !== 'unknown');
    if (query) list = list.filter(b => b.name.toLowerCase().includes(query.toLowerCase()) || b.areasServed.some(a => a.toLowerCase().includes(query.toLowerCase())));
    if (activeLetter) list = list.filter(b => b.name.toUpperCase().startsWith(activeLetter));
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [builders, query, activeLetter]);

  const availableLetters = new Set(builders.filter(b => b.builderType !== 'unknown').map(b => b.name[0].toUpperCase()));

  const allRows = useMemo(() => {
    const rows: { builder: typeof builders[0]; community: typeof communities[0] }[] = [];
    filtered.forEach(b => {
      communities.filter(c => c.builderId === b.id).forEach(c => rows.push({ builder: b, community: c }));
    });
    return rows;
  }, [filtered, communities]);

  return (
    <div className="pb-20 lg:pb-0">
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs crumbs={[{ label: 'Builders' }]} />
          <h1 className="text-2xl md:text-3xl font-bold text-primary mt-3">Myrtle Beach New Homes by Builder</h1>
          <p className="text-muted mt-1 text-sm">New home communities grouped by builder. Compare price ranges, areas served, and active communities.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search builders…"
              className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal w-64" />
          </div>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button onClick={() => setView('cards')} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${view === 'cards' ? 'bg-teal text-white' : 'text-muted hover:bg-sand-light'}`}><LayoutGrid size={15} /> Cards</button>
            <button onClick={() => setView('table')} className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors ${view === 'table' ? 'bg-teal text-white' : 'text-muted hover:bg-sand-light'}`}><List size={15} /> Table</button>
          </div>
        </div>

        {/* Alphabet nav */}
        <div className="flex flex-wrap gap-1 mb-6">
          <button onClick={() => setActiveLetter(null)} className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${activeLetter === null ? 'bg-teal text-white' : 'text-muted hover:text-teal hover:bg-teal-light'}`}>All</button>
          {ALPHA.map(l => (
            <button key={l} onClick={() => setActiveLetter(activeLetter === l ? null : l)}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-colors ${!availableLetters.has(l) ? 'text-muted/30 cursor-default' : activeLetter === l ? 'bg-teal text-white' : 'text-muted hover:text-teal hover:bg-teal-light'}`}
              disabled={!availableLetters.has(l)}>
              {l}
            </button>
          ))}
        </div>

        <p className="text-sm text-muted mb-5">Showing {filtered.length} builders</p>

        {view === 'cards' ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(b => (
              <BuilderCard key={b.id} builder={b} communities={communities.filter(c => c.builderId === b.id)} />
            ))}
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg border-b border-border sticky top-0">
                  <tr>
                    {['Builder','Community','Starting Price','Area','Status','Property Type','Last Verified',''].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-primary whitespace-nowrap text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allRows.map(({ builder: b, community: c }, i) => (
                    <tr key={i} className="border-b border-border hover:bg-sand-light/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-primary whitespace-nowrap">{b.name}</td>
                      <td className="px-4 py-3"><Link to={`/communities/${c.slug}`} className="text-teal hover:underline">{c.name}</Link></td>
                      <td className="px-4 py-3 text-navy font-medium whitespace-nowrap">{c.priceLabel}</td>
                      <td className="px-4 py-3 text-muted whitespace-nowrap">{c.area}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3 text-muted">{c.propertyTypes[0] || '—'}</td>
                      <td className="px-4 py-3 text-muted text-xs">{c.lastVerified}</td>
                      <td className="px-4 py-3"><Link to={`/communities/${c.slug}`} className="text-teal text-xs flex items-center gap-1 whitespace-nowrap">View <ArrowRight size={11} /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <p className="text-xs text-muted mt-6 text-center">Pricing and availability are estimates. Verify with the builder.</p>
      </div>
    </div>
  );
}
