import React, { useEffect } from 'react';
import { Phone, Mail, CheckCircle } from 'lucide-react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { InquiryForm } from '../components/detail/InquiryForm';
import { siteConfig } from '../config/siteConfig';
import { setPageMeta } from '../utils/seo';

export function ContactPage() {
  useEffect(() => { setPageMeta({ title: 'Contact | Myrtle Beach New Home Guide', description: 'Get local new construction guidance for Myrtle Beach, Conway, Carolina Forest, and the Grand Strand.' }); }, []);

  return (
    <div className="pb-20 lg:pb-0">
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumbs crumbs={[{ label: 'Contact' }]} />
          <h1 className="text-2xl md:text-3xl font-bold text-primary mt-3">Get Local New Home Guidance</h1>
          <p className="text-muted mt-1 text-sm">Tell us your target area, budget, and timeline. We'll help you compare communities and verify current availability.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card p-8">
              <InquiryForm />
            </div>
            <p className="text-xs text-muted mt-4 text-center">{siteConfig.disclaimer}</p>
          </div>

          <div className="space-y-5">
            <div className="card p-6">
              <h2 className="font-bold text-primary mb-4">Contact</h2>
              <div className="space-y-3 text-sm">
                <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-3 text-primary hover:text-teal transition-colors">
                  <div className="p-2 bg-teal-light rounded-lg"><Phone size={16} className="text-teal" /></div>
                  {siteConfig.phone}
                </a>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 text-primary hover:text-teal transition-colors">
                  <div className="p-2 bg-teal-light rounded-lg"><Mail size={16} className="text-teal" /></div>
                  {siteConfig.email}
                </a>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-bold text-primary mb-4">What Happens Next?</h2>
              <div className="space-y-4">
                {[
                  'We review your preferred areas and budget',
                  'We identify communities that match your criteria',
                  'We help you verify current pricing and availability',
                  'We connect you with builders or schedule visits',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal text-white flex items-center justify-center text-xs font-bold shrink-0">{i+1}</div>
                    <p className="text-sm text-muted leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6 bg-teal-light">
              <h2 className="font-bold text-primary mb-2">Presented by</h2>
              <p className="font-semibold text-navy">{siteConfig.sponsorName}</p>
              <p className="text-sm text-muted mt-1">{siteConfig.sponsorDisclaimer}</p>
              <div className="flex items-center gap-2 mt-3 text-sm text-teal">
                <CheckCircle size={14} /> Independent local guidance
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
