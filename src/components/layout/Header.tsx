import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Phone, Home, Scale } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { useApp } from '../../context/AppContext';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { comparison } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { to: '/builders', label: 'Builders' },
    { to: '/communities', label: 'Communities' },
    { to: '/areas', label: 'Areas' },
    { to: '/future-subdivisions', label: 'Future' },
    { to: '/recently-completed', label: 'Completed' },
    { to: '/resources', label: 'Resources' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/communities?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setMenuOpen(false);
      setQuery('');
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'bg-white shadow-md' : 'bg-white border-b border-border'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
                <Home size={16} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-navy font-bold text-base leading-tight block">Myrtle Beach</span>
                <span className="text-teal text-xs font-medium leading-tight block">New Home Guide</span>
              </div>
              <div className="sm:hidden">
                <span className="text-navy font-bold text-sm">MBNH Guide</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(l => (
                <NavLink key={l.to} to={l.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-teal bg-teal-light' : 'text-primary hover:text-teal hover:bg-teal-light/50'}`
                  }>
                  {l.label}
                </NavLink>
              ))}
            </nav>

            {/* Desktop right actions */}
            <div className="hidden lg:flex items-center gap-3">
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-1.5 text-sm text-muted hover:text-teal transition-colors">
                <Phone size={14} />
                {siteConfig.phone}
              </a>
              {comparison.length > 0 && (
                <Link to="/compare" className="flex items-center gap-1.5 text-sm font-medium text-teal hover:text-teal-dark transition-colors">
                  <Scale size={14} />
                  Compare ({comparison.length})
                </Link>
              )}
              <button onClick={() => setSearchOpen(s => !s)} aria-label="Search" className="p-2 rounded-lg text-muted hover:text-teal hover:bg-teal-light transition-colors">
                <Search size={18} />
              </button>
              <Link to="/contact" className="btn-primary">Ask About New Homes</Link>
            </div>

            {/* Mobile actions */}
            <div className="lg:hidden flex items-center gap-2">
              {comparison.length > 0 && (
                <Link to="/compare" className="flex items-center gap-1 text-xs font-medium text-teal">
                  <Scale size={14} />({comparison.length})
                </Link>
              )}
              <button onClick={() => setSearchOpen(s => !s)} aria-label="Search" className="p-2 rounded-lg text-muted hover:text-teal transition-colors">
                <Search size={20} />
              </button>
              <button onClick={() => setMenuOpen(s => !s)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} className="p-2 rounded-lg text-primary hover:bg-sand-light transition-colors">
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-3 pt-1">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search builder, community, city, area, or status…"
                  className="flex-1 border border-border rounded-lg px-4 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-teal"
                />
                <button type="submit" className="btn-teal px-4 py-2 text-sm">Search</button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-border shadow-lg">
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map(l => (
                <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-teal bg-teal-light' : 'text-primary hover:bg-sand-light'}`
                  }>
                  {l.label}
                </NavLink>
              ))}
              <div className="pt-3 border-t border-border mt-2 flex flex-col gap-2">
                <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-muted hover:bg-sand-light">
                  <Phone size={16} /> {siteConfig.phone}
                </a>
                <Link to="/contact" onClick={() => setMenuOpen(false)} className="btn-primary justify-center">Ask About New Homes</Link>
              </div>
            </nav>
          </div>
        )}
      </header>
      <div className="h-16" />
    </>
  );
}
