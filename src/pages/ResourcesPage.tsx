import React, { useEffect } from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { ResourceCard, RESOURCES } from '../components/cards/ResourceCard';
import { setPageMeta } from '../utils/seo';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function ResourcesPage() {
  useEffect(() => { setPageMeta({ title: 'New Construction Buyer Resources | Myrtle Beach New Home Guide', description: 'Guides and resources for buyers researching new construction homes in Myrtle Beach and the Grand Strand.' }); }, []);

  return (
    <div className="pb-20 lg:pb-0">
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs crumbs={[{ label: 'Resources' }]} />
          <h1 className="text-2xl md:text-3xl font-bold text-primary mt-3">New Construction Buyer Resources</h1>
          <p className="text-muted mt-1 text-sm">Guides to help you research, compare, and verify new home communities in the Grand Strand.</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {RESOURCES.map(r => <ResourceCard key={r.slug} resource={r} />)}
        </div>

        {/* Full article content */}
        <div className="space-y-12 max-w-3xl">
          {RESOURCES.map(r => (
            <article key={r.slug} id={r.slug} className="card p-8 scroll-mt-20">
              <span className="badge bg-teal-light text-teal-dark text-xs mb-3">{r.tag}</span>
              <h2 className="text-xl font-bold text-primary mb-4">{r.title}</h2>
              <p className="text-muted leading-relaxed mb-4">{r.summary}</p>
              <p className="text-muted leading-relaxed text-sm">
                This is a summary article. For detailed guidance specific to your situation, we recommend consulting with a local real estate professional who specializes in new construction in the Myrtle Beach area. Every buyer's needs and circumstances are different, and local expertise can make a significant difference in navigating the new construction process.
              </p>
              <div className="mt-5 pt-4 border-t border-border">
                <Link to="/contact" className="text-sm font-semibold text-teal flex items-center gap-1 hover:text-teal-dark">
                  Get personalized guidance <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <p className="text-xs text-muted mt-8 text-center">Information is for educational purposes only. Verify all details with appropriate professionals.</p>
      </div>
    </div>
  );
}
