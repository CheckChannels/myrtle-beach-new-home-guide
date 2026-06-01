import { Community, CommunityFilters, SortOption } from '../types';

export function filterCommunities(communities: Community[], filters: CommunityFilters): Community[] {
  return communities.filter(c => {
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      const match =
        c.name.toLowerCase().includes(kw) ||
        c.builderName.toLowerCase().includes(kw) ||
        c.area.toLowerCase().includes(kw) ||
        c.city.toLowerCase().includes(kw) ||
        c.status.toLowerCase().includes(kw);
      if (!match) return false;
    }
    if (filters.areas.length > 0 && !filters.areas.includes(c.area)) return false;
    if (filters.builders.length > 0 && !filters.builders.includes(c.builderId)) return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(c.status)) return false;
    if (filters.minPrice !== null && c.startingPrice && c.startingPrice < filters.minPrice) return false;
    if (filters.maxPrice !== null && c.startingPrice && c.startingPrice > filters.maxPrice) return false;
    if (filters.propertyTypes.length > 0) {
      const hasType = filters.propertyTypes.some(t =>
        c.propertyTypes.map(p => p.toLowerCase()).includes(t.toLowerCase())
      );
      if (!hasType) return false;
    }
    if (filters.amenities.length > 0) {
      const hasAll = filters.amenities.every(a =>
        c.amenities.map(x => x.toLowerCase()).includes(a.toLowerCase())
      );
      if (!hasAll) return false;
    }
    if (filters.quickMoveIn && !c.quickMoveInsAvailable) return false;
    if (filters.hideFuture && (c.status === 'Future Subdivision' || c.status === 'Coming Soon')) return false;
    if (filters.hideCompleted && (c.status === 'Completed' || c.status === 'Recently Completed')) return false;
    return true;
  });
}

export function sortCommunities(communities: Community[], sort: SortOption): Community[] {
  const sorted = [...communities];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => (a.startingPrice || Infinity) - (b.startingPrice || Infinity));
    case 'price-desc':
      return sorted.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
    case 'builder-az':
      return sorted.sort((a, b) => a.builderName.localeCompare(b.builderName));
    case 'area-az':
      return sorted.sort((a, b) => a.area.localeCompare(b.area));
    case 'newest':
      return sorted.sort((a, b) => b.lastVerified.localeCompare(a.lastVerified));
    default:
      return sorted;
  }
}

export const defaultFilters: CommunityFilters = {
  keyword: '',
  areas: [],
  builders: [],
  statuses: [],
  minPrice: null,
  maxPrice: null,
  propertyTypes: [],
  amenities: [],
  quickMoveIn: false,
  hideFuture: false,
  hideCompleted: false,
};
