import type { LocalizedText } from "@/i18n/types";
import type { DistrictCode } from "./intakeQuestions";

export interface CorporationInfo {
  office: LocalizedText;
  portalUrl: string;
  portalLabel: LocalizedText;
}

const GREATER_CHENNAI: CorporationInfo = {
  office: { en: "Greater Chennai Corporation", ta: "சென்னை மாநகராட்சி" },
  portalUrl: "https://chennaicorporation.gov.in/",
  portalLabel: { en: "Greater Chennai Corporation", ta: "சென்னை மாநகராட்சி" },
};

// Verified via web search: tnurbanepay.tn.gov.in is the real, unified TN
// government portal for property tax across every municipality/corporation
// in the state except Chennai (which has its own, above) — not a guess.
const TN_URBAN_EPAY_PORTAL = "https://tnurbanepay.tn.gov.in/";
const TN_URBAN_EPAY_LABEL: LocalizedText = { en: "TN Urban ePay portal", ta: "தமிழ்நாடு நகர்ப்புற இ-கட்டண போர்டல்" };

function corporation(en: string, ta: string): CorporationInfo {
  return {
    office: { en, ta },
    portalUrl: TN_URBAN_EPAY_PORTAL,
    portalLabel: TN_URBAN_EPAY_LABEL,
  };
}

const OTHER_FALLBACK: CorporationInfo = {
  office: { en: "Local Municipality / Town Panchayat Office", ta: "உள்ளூர் நகராட்சி / பேரூராட்சி அலுவலகம்" },
  portalUrl: TN_URBAN_EPAY_PORTAL,
  portalLabel: TN_URBAN_EPAY_LABEL,
};

export const corporationByDistrict: Record<DistrictCode, CorporationInfo> = {
  chennai: GREATER_CHENNAI,
  coimbatore: corporation("Coimbatore City Municipal Corporation", "கோயம்புத்தூர் மாநகராட்சி"),
  madurai: corporation("Madurai City Corporation", "மதுரை மாநகராட்சி"),
  tiruchirappalli: corporation("Tiruchirappalli City Corporation", "திருச்சிராப்பள்ளி மாநகராட்சி"),
  salem: corporation("Salem City Corporation", "சேலம் மாநகராட்சி"),
  tirunelveli: corporation("Tirunelveli City Corporation", "திருநெல்வேலி மாநகராட்சி"),
  tiruppur: corporation("Tiruppur City Corporation", "திருப்பூர் மாநகராட்சி"),
  erode: corporation("Erode City Corporation", "ஈரோடு மாநகராட்சி"),
  vellore: corporation("Vellore City Corporation", "வேலூர் மாநகராட்சி"),
  thoothukudi: corporation("Thoothukudi City Corporation", "தூத்துக்குடி மாநகராட்சி"),
  dindigul: corporation("Dindigul City Corporation", "திண்டுக்கல் மாநகராட்சி"),
  thanjavur: corporation("Thanjavur City Corporation", "தஞ்சாவூர் மாநகராட்சி"),
  other: OTHER_FALLBACK,
};

export function resolveCorporation(district: string | undefined): CorporationInfo {
  if (district && district in corporationByDistrict) {
    return corporationByDistrict[district as DistrictCode];
  }
  return OTHER_FALLBACK;
}
