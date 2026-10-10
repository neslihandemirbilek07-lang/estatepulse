export type ListingType = 'satilik' | 'kiralik';
export type PropertyType = 'daire' | 'villa' | 'rezidans' | 'mustakil' | 'arsa';

export interface Agent {
  id: string;
  name: string;
  agency: string;
  avatar: string;
  phone: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  activeListingsCount: number;
  responseRate: number;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  label?: string;
}

export interface ShapFactor {
  factor: string;
  impactTRY: number;
  isPositive: boolean;
  description: string;
}

export interface AVMValuation {
  estimatedPrice: number;
  lowBound: number;
  highBound: number;
  confidenceScore: number; // e.g. 94 (%)
  valuationVerdict: 'firsat' | 'degerinde' | 'piyasa_ustu';
  discountPercentage?: number; // e.g. -7%
  projectedAppreciation1Year: number; // e.g. +38%
  projectedAppreciation3Year: number; // e.g. +115%
  rentalYieldEstimatedMonthly: number;
  shapFactors: ShapFactor[];
}

export interface LifestyleScores {
  walkScore: number;
  transitScore: number;
  schoolScore: number;
  safetyScore: number;
  greenSpaceScore: number;
  earthquakeSoilRisk: number; // 1.0 (En Sağlam) - 5.0 (Yüksek Risk)
  nearestMetroDistanceMeters: number;
  nearestSchoolDistanceMeters: number;
  nearestHospitalDistanceMeters: number;
}

export interface VirtualStagingPair {
  emptyImageUrl: string;
  stagedImageUrl: string;
  styleName: string;
  roomName: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  currency: string;
  dues: number; // Aidat
  grossSqm: number;
  netSqm: number;
  roomCount: string; // e.g. '3+1'
  bedrooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  buildingAge: number;
  heating: string;
  hasBalcony: boolean;
  hasElevator: boolean;
  hasParking: boolean;
  hasPool: boolean;
  isFurnished: boolean;
  deedStatus: string; // e.g. 'Kat Mülkiyeti'
  
  // Geolocation
  city: string;
  district: string;
  neighborhood: string;
  addressLine: string;
  lat: number;
  lng: number;
  
  // Media & 3D
  coverImage: string;
  images: string[];
  hasVirtualTour360: boolean;
  panoramaImageUrl?: string;
  hasVirtualStaging: boolean;
  stagingPairs?: VirtualStagingPair[];
  
  // AVM & Intelligence
  avm: AVMValuation;
  lifestyle: LifestyleScores;
  priceHistory: PriceHistoryPoint[];
  
  // Status & Badges
  isFeatured: boolean;
  isUrgent: boolean;
  isVerified: boolean;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  agent: Agent;
}

export interface Offer {
  id: string;
  propertyId: string;
  propertyTitle: string;
  buyerName: string;
  buyerPhone: string;
  amount: number;
  earnestDeposit: number;
  contingentOnMortgage: boolean;
  status: 'bekliyor' | 'karsi_teklif' | 'kabul_edildi' | 'reddedildi';
  counterAmount?: number;
  expiresInHours: number;
  createdAt: string;
}

export interface FilterState {
  listingType: ListingType;
  propertyType: string;
  city: string;
  district: string;
  minPrice?: number;
  maxPrice?: number;
  roomCount: string;
  minSqm?: number;
  buildingAgeMax?: number;
  only3DTour: boolean;
  onlyVirtualStaged: boolean;
  onlyVerified: boolean;
  onlyOpportunity: boolean;
}
