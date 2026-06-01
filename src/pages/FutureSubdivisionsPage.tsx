import React, { useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommunityCard } from '../components/cards/CommunityCard';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { setPageMeta } from '../utils/seo';

export function FutureSubdivisionsPage() {
  const { communities } = useApp();
  const future = communities.filter(c => c.status === 'Future Subdivision' || c.status === 'Coming Soon');

  useEffect(() => { setPageMeta({ title: 'Future New Home Subdivisions in Myrtle Beach', description: 'Browse planned and early-stage new home communities in Myrtle Beach and the Grand Strand. Details are preliminary.' }); }, []);

  return (
    <div className="pb-20 lg:pb-0">
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs crumbs={[{ label: 'Future Subdivisions' }]} />
          <div className="flex items-start gap-3 mt-3">
            <div className="p-2 bg-warning/10 rounded-lg shrink-0"><Clock size={22} className="text-amber-600" /></div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">Future New Home Subdivisions</h1>
              <p className="text-muted mt-1 text-sm">{future.length} planned or early-stage communities in the Grand Strand</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <strong className="text-primary">About Future Subdivisions:</strong>
            <span className="text-muted ml-1">These are planned or early-stage communities where pricing, builder assignment, timing, and floor plans may be incomplete or unconfirmed. All details are preliminary and subject to change. Verify directly with the builder or developer.</span>
          </div>
        </div>

        {future.length === 0 ? (
          <p className="text-muted text-center py-16">No future subdivisions currently listed.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {future.map(c => <CommunityCard key={c.id} community={c} />)}
          </div>
        )}
        <p className="text-xs text-muted mt-8 text-center">All future subdivision information is preliminary. Verify with builder before making any decisions.</p>
      </div>
    </div>
  );
}
