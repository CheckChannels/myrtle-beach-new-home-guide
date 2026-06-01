import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { Community } from '../../types';
import { communityCoords } from '../../data/communityCoords';

const STATUS_COLORS: Record<string, string> = {
  'Under Construction':  '#0E7C7B',
  'Future Subdivision':  '#D99A2B',
  'Coming Soon':         '#3B82F6',
  'Recently Completed':  '#1F9D55',
  'Completed':           '#6B7280',
  'Leasing':             '#8B5CF6',
  'Sold Out':            '#C0392B',
  'Price TBD':           '#D96C4A',
};

function makeIcon(status: string, highlight = false) {
  const color = STATUS_COLORS[status] ?? '#0B3558';
  const s = highlight ? 36 : 26;
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="white" stroke-width="1.2"/>
      <circle cx="12" cy="9" r="2.8" fill="white"/>
    </svg>`
  );
  return L.icon({
    iconUrl: `data:image/svg+xml,${svg}`,
    iconSize: [s, s],
    iconAnchor: [s / 2, s],
    popupAnchor: [0, -s + 4],
  });
}

interface CommunityMapProps {
  communities: Community[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  height?: string;
}

export function CommunityMap({ communities, selectedId, onSelect, height = '500px' }: CommunityMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const navigate = useNavigate();

  const mapped = communities.filter(c => communityCoords[c.slug]);
  const unmapped = communities.length - mapped.length;

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [33.75, -78.87],
      zoom: 10,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // Sync markers whenever communities list changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers not in current list
    const currentSlugs = new Set(mapped.map(c => c.id));
    markersRef.current.forEach((marker, id) => {
      if (!currentSlugs.has(id)) { marker.remove(); markersRef.current.delete(id); }
    });

    // Add / update markers
    mapped.forEach(c => {
      const coords = communityCoords[c.slug];
      const isHighlighted = c.id === selectedId;

      if (markersRef.current.has(c.id)) {
        markersRef.current.get(c.id)!.setIcon(makeIcon(c.status, isHighlighted));
        return;
      }

      const marker = L.marker(coords, { icon: makeIcon(c.status, false) }).addTo(map);

      const popupHtml = `
        <div style="min-width:180px;font-family:system-ui,sans-serif">
          <span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;background:${STATUS_COLORS[c.status] ?? '#ccc'}22;color:${STATUS_COLORS[c.status] ?? '#555'};border:1px solid ${STATUS_COLORS[c.status] ?? '#ccc'}44;margin-bottom:4px">${c.status}</span>
          <div style="font-weight:700;font-size:13px;color:#102A43;margin-bottom:2px">${c.name}</div>
          <div style="font-size:11px;color:#5F6F7E;margin-bottom:2px">${c.builderName} · ${c.area}</div>
          <div style="font-size:12px;font-weight:700;color:#0B3558;margin-bottom:8px">${c.priceLabel}</div>
          <a href="/communities/${c.slug}"
             style="display:inline-block;background:#0E7C7B;color:white;padding:5px 12px;border-radius:6px;font-size:11px;font-weight:600;text-decoration:none"
             data-slug="${c.slug}">
            View Details →
          </a>
        </div>`;

      marker.bindPopup(popupHtml, { maxWidth: 240 });

      marker.on('click', () => {
        onSelect?.(c.id);
      });

      // Handle popup link clicks via delegation
      marker.on('popupopen', () => {
        setTimeout(() => {
          const link = document.querySelector<HTMLAnchorElement>(`a[data-slug="${c.slug}"]`);
          link?.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(`/communities/${c.slug}`);
          });
        }, 50);
      });

      markersRef.current.set(c.id, marker);
    });
  }, [mapped, navigate, onSelect, selectedId]);

  // Update icons when selection changes (without re-creating markers)
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const community = mapped.find(c => c.id === id);
      if (community) marker.setIcon(makeIcon(community.status, id === selectedId));
    });
  }, [selectedId, mapped]);

  // Fly to selected
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const community = mapped.find(c => c.id === selectedId);
    if (!community) return;
    const coords = communityCoords[community.slug];
    if (coords) map.flyTo(coords, 13, { duration: 0.8 });
  }, [selectedId, mapped]);

  // Fit bounds when community list changes significantly
  useEffect(() => {
    const map = mapRef.current;
    if (!map || mapped.length === 0) return;
    const bounds = L.latLngBounds(mapped.map(c => communityCoords[c.slug]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
  }, [communities.length]); // only re-fit when count changes, not on every filter

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border" style={{ height }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />

      {/* Legend */}
      <div className="absolute bottom-6 left-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-md p-3 text-xs space-y-1.5 pointer-events-none">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-primary">{status}</span>
          </div>
        ))}
        <p className="text-muted/60 text-[10px] pt-1 border-t border-border">Positions approximate</p>
      </div>

      {unmapped > 0 && (
        <div className="absolute top-3 right-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs text-muted shadow pointer-events-none">
          {unmapped} {unmapped === 1 ? 'community' : 'communities'} without map data
        </div>
      )}
    </div>
  );
}
