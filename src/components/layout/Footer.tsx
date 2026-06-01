import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Phone, Mail, ArrowRight } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export function Footer() {
  const areas = ['Myrtle Beach','Conway','Carolina Forest','Longs','Little River','North Myrtle Beach','Murrells Inlet','Surfside Beach','Pawleys Island'];
  const builders = ["D.R. Horton","Lennar","Pulte Homes","Toll Brothers","Ryan Homes","Beazer Homes","Dream Finders Homes","Great Southern Homes"];
  const resources = [
    { to: '/resources', label: 'Resource Hub' },
    { to: '/future-subdivisions', label: 'Future Subdivisions' },
    { to: '/recently-completed', label: 'Recently Completed' },
    { to: '/compare', label: 'Compare Communities' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/admin', label: 'Admin' },
  ];

  return (
    <footer className="bg-navy text-white/80 mt-16">
      {/* Sponsor bar */}
      <div className="bg-teal/20 border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">Presented by</p>
              <p className="text-white font-semibold">{siteConfig.sponsorName}</p>
              <p className="text-white/60 text-sm">Independent local guidance for Grand Strand new construction</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors">
                <Phone size={15} /> {siteConfig.phone}
              </a>
              <Link to="/contact" className="flex items-center gap-2 bg-coral hover:bg-coral-dark px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors">
                Request Local Guidance <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Home size={16} className="text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-sm block">Myrtle Beach</span>
                <span className="text-teal-light text-xs block">New Home Guide</span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">{siteConfig.tagline}</p>
            <div className="flex flex-col gap-1 text-sm">
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"><Phone size={13} />{siteConfig.phone}</a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"><Mail size={13} />{siteConfig.email}</a>
            </div>
          </div>

          {/* Popular Areas */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Popular Areas</h4>
            <ul className="space-y-2">
              {areas.map(a => (
                <li key={a}>
                  <Link to={`/areas/${a.toLowerCase().replace(/\s+/g,'-')}`} className="text-sm text-white/60 hover:text-white transition-colors">
                    {a}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Builders */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Top Builders</h4>
            <ul className="space-y-2">
              {builders.map(b => (
                <li key={b}>
                  <Link to={`/builders/${b.toLowerCase().replace(/[\s.]+/g,'-').replace(/--+/g,'-')}`} className="text-sm text-white/60 hover:text-white transition-colors">
                    {b}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {resources.map(r => (
                <li key={r.to}>
                  <Link to={r.to} className="text-sm text-white/60 hover:text-white transition-colors">{r.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/10 pt-8">
          <div className="bg-white/5 rounded-lg p-4 mb-6 text-xs text-white/50 leading-relaxed">
            <strong className="text-white/70">Disclaimer:</strong> {siteConfig.disclaimer}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-white/40">
            <div className="flex flex-wrap gap-4">
              <span>© {new Date().getFullYear()} {siteConfig.siteName}</span>
              <span className="flex items-center gap-1">
                <span className="text-white/60">⊜</span> Equal Housing Opportunity
              </span>
              <span>Last updated: {siteConfig.lastUpdated}</span>
            </div>
            <p className="text-white/40 max-w-md text-right">Pricing and availability are estimates. Verify with builder.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
