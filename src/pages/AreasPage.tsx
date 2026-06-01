import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AreaCard } from '../components/cards/AreaCard';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { areas as areaData } from '../data/sampleData';
import { getCommunitiesByArea } from '../utils/stats';
import { setPageMeta } from '../utils/seo';

export function AreasPage() {
  const { communities } = useApp();
  useEffect(() => { setPageMeta({ title: 'New Home Communities by Area | Myrtle Beach Grand Strand', description: 'Explore new home communities by area across Myrtle Beach, Conway, Carolina Forest, Longs, North Myrtle Beach, and the Grand Strand.' }); }, []);

  return (
    <div className="pb-20 lg:pb-0">
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs crumbs={[{ label: 'Areas' }]} />
          <h1 className="text-2xl md:text-3xl font-bold text-primary mt-3">Explore New Homes by Myrtle Beach Area</h1>
          <p className="text-muted mt-1 text-sm">Browse new construction communities by location across the Grand Strand.</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {areaData.map(area => (
            <AreaCard key={area.id} area={area} communities={getCommunitiesByArea(communities, area.name)} />
          ))}
        </div>
        <p className="text-xs text-muted mt-8 text-center">Pricing and availability are estimates. Verify with the builder.</p>
      </div>
    </div>
  );
}
