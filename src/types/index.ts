export interface FloorPlan {
  id: string;
  name: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  stories?: number;
  garage?: number;
  startingPrice?: number;
  description?: string;
}

export type CommunityStatus =
  | 'Under Construction'
  | 'Future Subdivision'
  | 'Coming Soon'
  | 'Recently Completed'
  | 'Completed'
  | 'Leasing'
  | 'Sold Out'
  | 'Price TBD';

export type BuilderType = 'national' | 'regional' | 'local' | 'custom' | 'unknown';
export type DataConfidence = 'High' | 'Medium' | 'Low';
export type SourceType = 'sample' | 'manual' | 'builder' | 'mls' | 'public-record' | 'unknown';

export interface Builder {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description: string;
  websiteUrl?: string;
  phone?: string;
  email?: string;
  builderType: BuilderType;
  specialties: string[];
  areasServed: string[];
  communityIds: string[];
  lastVerified?: string;
  sourceNotes?: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  builderId: string;
  builderName: string;
  area: string;
  city: string;
  state: string;
  zip?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  status: CommunityStatus;
  startingPrice?: number;
  priceLabel: string;
  propertyTypes: string[];
  minBeds?: number;
  maxBeds?: number;
  minBaths?: number;
  maxBaths?: number;
  minSqft?: number;
  maxSqft?: number;
  garages?: string;
  stories?: string;
  amenities: string[];
  highlights: string[];
  description: string;
  imageUrls: string[];
  floorPlans: FloorPlan[];
  quickMoveInsAvailable?: boolean;
  completedYear?: number;
  lastVerified: string;
  dataConfidence: DataConfidence;
  sourceType: SourceType;
  disclaimer?: string;
}

export interface AreaData {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  nearbyAreas: string[];
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  budget?: string;
  timeframe?: string;
  preferredAreas: string[];
  communityId?: string;
  builderId?: string;
  message: string;
  createdAt: string;
}

export interface CommunityFilters {
  keyword: string;
  areas: string[];
  builders: string[];
  statuses: CommunityStatus[];
  minPrice: number | null;
  maxPrice: number | null;
  propertyTypes: string[];
  amenities: string[];
  quickMoveIn: boolean;
  hideFuture: boolean;
  hideCompleted: boolean;
}

export type SortOption =
  | 'recommended'
  | 'price-asc'
  | 'price-desc'
  | 'builder-az'
  | 'area-az'
  | 'newest';

export interface MarketStats {
  totalCommunities: number;
  activeBuilders: number;
  underConstruction: number;
  futureSubdivisions: number;
  recentlyCompleted: number;
  lowestStartingPrice: number | null;
}
