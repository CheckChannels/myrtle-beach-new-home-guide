import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Scale } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { useApp } from '../../context/AppContext';

export function StickyContactBar() {
  const { comparison } = useApp();
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-lg">
      <div className="flex">
        <a href={`tel:${siteConfig.phone}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-navy border-r border-border hover:bg-sand-light transition-colors">
          <Phone size={16} /> Call Now
        </a>
        {comparison.length > 0 ? (
          <Link to="/compare"
            className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-teal border-r border-border hover:bg-teal-light transition-colors">
            <Scale size={16} /> Compare ({comparison.length})
          </Link>
        ) : null}
        <Link to="/contact"
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-coral hover:bg-coral-dark transition-colors">
          Get Guidance
        </Link>
      </div>
    </div>
  );
}
