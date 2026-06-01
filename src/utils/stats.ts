import { Community, Builder, MarketStats } from '../types';

export function calculateMarketStats(communities: Community[], builders: Builder[]): MarketStats {
  const prices = communities.filter(c => c.startingPrice).map(c => c.startingPrice as number);
  return {
    totalCommunities: communities.length,
    activeBuilders: builders.filter(b => b.builderType !== 'unknown').length,
    underConstruction: communities.filter(c => c.status === 'Under Construction').length,
    futureSubdivisions: communities.filter(
      c => c.status === 'Future Subdivision' || c.status === 'Coming Soon'
    ).length,
    recentlyCompleted: communities.filter(
      c => c.status === 'Recently Completed' || c.status === 'Completed'
    ).length,
    lowestStartingPrice: prices.length > 0 ? Math.min(...prices) : null,
  };
}

export function getPriceRange(communities: Community[]): { min: number | null; max: number | null } {
  const prices = communities.filter(c => c.startingPrice).map(c => c.startingPrice as number);
  if (prices.length === 0) return { min: null, max: null };
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getStatusCounts(communities: Community[]): Record<string, number> {
  return communities.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function getBuilderById(builders: Builder[], id: string): Builder | undefined {
  return builders.find(b => b.id === id || b.slug === id);
}

export function getCommunitiesByBuilder(communities: Community[], builderId: string): Community[] {
  return communities.filter(c => c.builderId === builderId);
}

export function getCommunitiesByArea(communities: Community[], area: string): Community[] {
  return communities.filter(c => c.area.toLowerCase() === area.toLowerCase());
}
