import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CommunityCard } from '../components/cards/CommunityCard';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { setPageMeta } from '../utils/seo';

export function RecentlyCompletedPage() {
  const { communities } = useApp();
  const completed = communities.filter(c => c.status === 'Completed' || c.status === 'Recently Completed');

  useEffect(() => { setPageMeta({ title: 'Recently Completed New Home Communities in Myrtle Beach', description: 'Browse recently completed new construction communities in Myrtle Beach and the Grand Strand.' }); }, []);

  return (
    <div className="pb-20 lg:pb-0">
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs crumbs={[{ label: 'Recently Completed' }]} />
          <div className="flex items-start gap-3 mt-3">
            <div className="p-2 bg-success/10 rounded-lg shrink-0"><CheckCircle size={22} className="text-success" /></div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary">Recently Completed Communities</h1>
              <p className="text-muted mt-1 text-sm">{completed.length} completed communities in the Grand Strand</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 mb-6 text-sm">
          <strong className="text-primary">Why browse completed communities?</strong>
          <ul className="list-disc list-inside text-muted mt-2 space-y-1">
            <li>Existing resale inventory may become available in completed communities</li>
            <li>Helps you understand builder quality, neighborhood character, and HOA conditions</li>
            <li>Completed communities offer a realistic preview of finished product</li>
          </ul>
        </div>

        {completed.length === 0 ? (
          <p className="text-muted text-center py-16">No recently completed communities currently listed.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {completed.map(c => <CommunityCard key={c.id} community={c} />)}
          </div>
        )}
        <p className="text-xs text-muted mt-8 text-center">Verify current resale availability with a local real estate professional.</p>
      </div>
    </div>
  );
}
