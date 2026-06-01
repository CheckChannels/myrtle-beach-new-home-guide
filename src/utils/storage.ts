import { Community, Builder } from '../types';
import { builders as sampleBuilders, communities as sampleCommunities } from '../data/sampleData';

const COMPARISON_KEY = 'mbnh_comparison';
const FAVORITES_KEY = 'mbnh_favorites';
const COMMUNITIES_KEY = 'mbnh_communities';
const BUILDERS_KEY = 'mbnh_builders';

export function getComparisonFromLocalStorage(): string[] {
  try {
    return JSON.parse(localStorage.getItem(COMPARISON_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveComparisonToLocalStorage(ids: string[]): void {
  localStorage.setItem(COMPARISON_KEY, JSON.stringify(ids));
}

export function getFavoritesFromLocalStorage(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveFavoritesToLocalStorage(ids: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function getCommunitiesFromStorage(): Community[] {
  try {
    const stored = localStorage.getItem(COMMUNITIES_KEY);
    return stored ? JSON.parse(stored) : sampleCommunities;
  } catch {
    return sampleCommunities;
  }
}

export function saveCommunitiesToStorage(communities: Community[]): void {
  localStorage.setItem(COMMUNITIES_KEY, JSON.stringify(communities));
}

export function getBuildersFromStorage(): Builder[] {
  try {
    const stored = localStorage.getItem(BUILDERS_KEY);
    return stored ? JSON.parse(stored) : sampleBuilders;
  } catch {
    return sampleBuilders;
  }
}

export function saveBuildersToStorage(builders: Builder[]): void {
  localStorage.setItem(BUILDERS_KEY, JSON.stringify(builders));
}

export function resetToSampleData(): void {
  localStorage.removeItem(COMMUNITIES_KEY);
  localStorage.removeItem(BUILDERS_KEY);
}

export function exportData(): string {
  return JSON.stringify(
    { builders: getBuildersFromStorage(), communities: getCommunitiesFromStorage() },
    null,
    2
  );
}

export function importData(json: string): { builders: Builder[]; communities: Community[] } {
  const data = JSON.parse(json);
  saveBuildersToStorage(data.builders || []);
  saveCommunitiesToStorage(data.communities || []);
  return data;
}
