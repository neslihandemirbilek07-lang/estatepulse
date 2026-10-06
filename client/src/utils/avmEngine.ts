export interface AVMInput {
  city: string;
  district: string;
  grossSqm: number;
  buildingAge: number;
  floor: number;
  totalFloors: number;
  hasElevator: boolean;
  hasParking: boolean;
  hasView: boolean;
  deedStatus: string;
}

export interface AVMResult {
  estimatedPrice: number;
  lowBound: number;
  highBound: number;
  confidenceScore: number;
  pricePerSqm: number;
  rentalEstimateMonthly: number;
  appreciation1YearPct: number;
  appreciation3YearPct: number;
  shapBreakdown: { factor: string; amountTRY: number; positive: boolean }[];
}

const DISTRICT_BASE_SQM_RATES: Record<string, number> = {
  'Kadıköy - Caferağa (Moda)': 52000,
  'Kadıköy - Suadiye': 98000,
  'Beşiktaş - Bebek': 110000,
  'Sarıyer - Zekeriyaköy': 85000,
  'Antalya - Konyaaltı': 42000,
  'Antalya - Muratpaşa': 38000,
  'Ankara - Çankaya (GOP)': 44000,
  'Bodrum - Yalıkavak': 95000,
  'Varsayılan (Diğer)': 35000
};

export function calculateAVMValuation(input: AVMInput): AVMResult {
  const districtKey = Object.keys(DISTRICT_BASE_SQM_RATES).find(k =>
    k.toLowerCase().includes(input.district.toLowerCase())
  ) || 'Varsayılan (Diğer)';

  const baseSqmRate = DISTRICT_BASE_SQM_RATES[districtKey];
  let basePrice = input.grossSqm * baseSqmRate;

  const shapBreakdown: { factor: string; amountTRY: number; positive: boolean }[] = [];

  // 1. Building Age Impact
  let ageMultiplier = 1.0;
  if (input.buildingAge === 0) {
    ageMultiplier = 1.15; // +15% premium for brand new
    shapBreakdown.push({ factor: 'Sıfır Yapı Primi (0 Yaş)', amountTRY: Math.round(basePrice * 0.15), positive: true });
  } else if (input.buildingAge <= 5) {
    ageMultiplier = 1.05;
    shapBreakdown.push({ factor: 'Genç Bina (1-5 Yaş)', amountTRY: Math.round(basePrice * 0.05), positive: true });
  } else if (input.buildingAge >= 20) {
    ageMultiplier = 0.85; // -15% depreciation
    shapBreakdown.push({ factor: '20+ Yıl Bina Yıpranma İndirimi', amountTRY: Math.round(basePrice * 0.15), positive: false });
  } else {
    ageMultiplier = 0.95;
  }

  // 2. Floor Impact
  let floorImpact = 0;
  if (input.floor === 0) {
    floorImpact = -basePrice * 0.08;
    shapBreakdown.push({ factor: 'Zemin/Giriş Kat İskontosu', amountTRY: Math.abs(Math.round(floorImpact)), positive: false });
  } else if (input.floor >= 3 && input.floor < input.totalFloors) {
    floorImpact = basePrice * 0.06;
    shapBreakdown.push({ factor: 'Ara Kat Değer Artışı', amountTRY: Math.round(floorImpact), positive: true });
  } else if (input.floor === input.totalFloors && input.hasElevator) {
    floorImpact = basePrice * 0.08;
    shapBreakdown.push({ factor: 'En Üst Kat / Teras Değeri', amountTRY: Math.round(floorImpact), positive: true });
  }

  // 3. Elevator
  let elevatorImpact = 0;
  if (input.hasElevator) {
    elevatorImpact = basePrice * 0.04;
    shapBreakdown.push({ factor: 'Asansör Erişimi', amountTRY: Math.round(elevatorImpact), positive: true });
  }

  // 4. Parking
  let parkingImpact = 0;
  if (input.hasParking) {
    parkingImpact = basePrice * 0.07;
    shapBreakdown.push({ factor: 'Kapalı / Açık Otopark', amountTRY: Math.round(parkingImpact), positive: true });
  }

  // 5. View
  let viewImpact = 0;
  if (input.hasView) {
    viewImpact = basePrice * 0.10;
    shapBreakdown.push({ factor: 'Açık / Deniz / Şehir Manzarası', amountTRY: Math.round(viewImpact), positive: true });
  }

  const calculatedTotal = (basePrice * ageMultiplier) + floorImpact + elevatorImpact + parkingImpact + viewImpact;
  const estimatedPrice = Math.round(calculatedTotal / 10000) * 10000;
  const lowBound = Math.round((estimatedPrice * 0.94) / 10000) * 10000;
  const highBound = Math.round((estimatedPrice * 1.06) / 10000) * 10000;

  // Monthly rental yield ~ 1 / 180 to 1 / 200 of capital value
  const rentalEstimateMonthly = Math.round((estimatedPrice * 0.0052) / 500) * 500;

  return {
    estimatedPrice,
    lowBound,
    highBound,
    confidenceScore: 94,
    pricePerSqm: Math.round(estimatedPrice / input.grossSqm),
    rentalEstimateMonthly,
    appreciation1YearPct: 37.5,
    appreciation3YearPct: 118.0,
    shapBreakdown
  };
}
