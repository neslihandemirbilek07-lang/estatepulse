import { Property } from '../types';

export interface ParsedNLPQuery {
  detectedCity?: string;
  detectedDistrict?: string;
  detectedRooms?: string;
  detectedFeatures: string[];
  maxPrice?: number;
  highlightSummary: string;
}

export function parseNaturalLanguageQuery(query: string): ParsedNLPQuery {
  const normalized = query.toLowerCase().trim();
  const detectedFeatures: string[] = [];
  let detectedCity: string | undefined;
  let detectedDistrict: string | undefined;
  let detectedRooms: string | undefined;
  let maxPrice: number | undefined;

  // Locations
  if (normalized.includes('antalya')) detectedCity = 'Antalya';
  if (normalized.includes('istanbul') || normalized.includes('i̇stanbul')) detectedCity = 'İstanbul';
  if (normalized.includes('ankara')) detectedCity = 'Ankara';
  if (normalized.includes('bodrum') || normalized.includes('muğla')) detectedCity = 'Muğla';

  if (normalized.includes('kadıköy') || normalized.includes('kadikoy') || normalized.includes('moda')) {
    detectedDistrict = 'Kadıköy';
    detectedCity = 'İstanbul';
  } else if (normalized.includes('konyaaltı') || normalized.includes('konyaalti')) {
    detectedDistrict = 'Konyaaltı';
    detectedCity = 'Antalya';
  } else if (normalized.includes('bebek') || normalized.includes('beşiktaş') || normalized.includes('besiktas')) {
    detectedDistrict = 'Beşiktaş';
    detectedCity = 'İstanbul';
  } else if (normalized.includes('çankaya') || normalized.includes('cankaya') || normalized.includes('gop')) {
    detectedDistrict = 'Çankaya';
    detectedCity = 'Ankara';
  } else if (normalized.includes('yalıkavak') || normalized.includes('yalikavak')) {
    detectedDistrict = 'Bodrum';
    detectedCity = 'Muğla';
  }

  // Room counts
  if (normalized.includes('3+1') || normalized.includes('üç artı bir') || normalized.includes('3 oda')) {
    detectedRooms = '3+1';
  } else if (normalized.includes('4+1') || normalized.includes('dört artı bir')) {
    detectedRooms = '4+1';
  } else if (normalized.includes('2+1') || normalized.includes('iki artı bir')) {
    detectedRooms = '2+1';
  } else if (normalized.includes('1+1') || normalized.includes('bir artı bir')) {
    detectedRooms = '1+1';
  }

  // Features
  if (normalized.includes('havuz') || normalized.includes('havuzlu')) detectedFeatures.push('Havuz');
  if (normalized.includes('deniz') || normalized.includes('sahil')) detectedFeatures.push('Deniz & Sahil');
  if (normalized.includes('metro') || normalized.includes('tramvay') || normalized.includes('ulaşım')) detectedFeatures.push('Metro/Ulaşım');
  if (normalized.includes('sıfır') || normalized.includes('sifir') || normalized.includes('yeni bina')) detectedFeatures.push('Sıfır Yapı');
  if (normalized.includes('otopark') || normalized.includes('garaj')) detectedFeatures.push('Otopark');
  if (normalized.includes('balkon') || normalized.includes('teras')) detectedFeatures.push('Balkon/Teras');
  if (normalized.includes('villa') || normalized.includes('müstakil')) detectedFeatures.push('Villa/Müstakil');
  if (normalized.includes('fırsat') || normalized.includes('uygun') || normalized.includes('hesaplı')) detectedFeatures.push('Fırsat Değerleme');

  // Simple price parsing: e.g. "10 milyon altı", "5m"
  const priceMatch = normalized.match(/(\d+)\s*(milyon|m)/);
  if (priceMatch) {
    const val = parseInt(priceMatch[1], 10);
    maxPrice = val * 1000000;
  }

  const parts = [];
  if (detectedCity || detectedDistrict) parts.push(`📍 ${detectedDistrict || detectedCity}`);
  if (detectedRooms) parts.push(`🛏️ ${detectedRooms}`);
  if (detectedFeatures.length > 0) parts.push(`✨ ${detectedFeatures.join(', ')}`);
  if (maxPrice) parts.push(`🏷️ Max ${(maxPrice / 1000000).toLocaleString('tr-TR')}M ₺`);

  return {
    detectedCity,
    detectedDistrict,
    detectedRooms,
    detectedFeatures,
    maxPrice,
    highlightSummary: parts.length > 0 ? parts.join(' | ') : 'Tüm Kriterler'
  };
}

export function filterAndScoreProperties(
  properties: Property[],
  query: string
): { property: Property; score: number; matchReasons: string[] }[] {
  if (!query || query.trim().length === 0) {
    return properties.map(p => ({ property: p, score: 100, matchReasons: [] }));
  }

  const parsed = parseNaturalLanguageQuery(query);
  const normalized = query.toLowerCase();

  const scored = properties.map(property => {
    let score = 50; // base score
    const matchReasons: string[] = [];

    // City match
    if (parsed.detectedCity) {
      if (property.city.toLowerCase() === parsed.detectedCity.toLowerCase()) {
        score += 30;
        matchReasons.push(`Şehir: ${property.city}`);
      } else {
        score -= 25;
      }
    }

    // District match
    if (parsed.detectedDistrict) {
      if (property.district.toLowerCase().includes(parsed.detectedDistrict.toLowerCase()) ||
          property.neighborhood.toLowerCase().includes(parsed.detectedDistrict.toLowerCase())) {
        score += 35;
        matchReasons.push(`Bölge: ${property.district}`);
      }
    }

    // Rooms match
    if (parsed.detectedRooms) {
      if (property.roomCount === parsed.detectedRooms) {
        score += 25;
        matchReasons.push(`Oda Sayısı: ${property.roomCount}`);
      }
    }

    // Features match
    if (parsed.detectedFeatures.includes('Havuz') && property.hasPool) {
      score += 20;
      matchReasons.push('Yüzme Havuzu');
    }
    if (parsed.detectedFeatures.includes('Deniz & Sahil') && (property.title.toLowerCase().includes('deniz') || property.description.toLowerCase().includes('sahil'))) {
      score += 20;
      matchReasons.push('Deniz & Sahil Erişimi');
    }
    if (parsed.detectedFeatures.includes('Sıfır Yapı') && property.buildingAge === 0) {
      score += 20;
      matchReasons.push('Sıfır Bina (0 Yaş)');
    }
    if (parsed.detectedFeatures.includes('Metro/Ulaşım') && property.lifestyle.nearestMetroDistanceMeters <= 500) {
      score += 20;
      matchReasons.push('Metroya < 500m');
    }
    if (parsed.detectedFeatures.includes('Otopark') && property.hasParking) {
      score += 15;
      matchReasons.push('Otopark Mevcut');
    }
    if (parsed.detectedFeatures.includes('Villa/Müstakil') && property.propertyType === 'villa') {
      score += 25;
      matchReasons.push('Müstakil Villa');
    }
    if (parsed.detectedFeatures.includes('Fırsat Değerleme') && property.avm.valuationVerdict === 'firsat') {
      score += 20;
      matchReasons.push('AI Fırsat Fiyatı');
    }

    // Max price constraint
    if (parsed.maxPrice) {
      if (property.price <= parsed.maxPrice) {
        score += 15;
      } else {
        score -= 40;
      }
    }

    // Direct textual match in title or description
    const queryTokens = normalized.split(/\s+/).filter(t => t.length > 2);
    for (const token of queryTokens) {
      if (property.title.toLowerCase().includes(token) || property.description.toLowerCase().includes(token)) {
        score += 8;
      }
    }

    return { property, score, matchReasons };
  });

  return scored.sort((a, b) => b.score - a.score);
}
