/**
 * Single source of truth for Yaba Fast Food branches.
 * Layout adapts dynamically for 3 to 10+ branches.
 */
export const branchesData = [
  {
    id: "tegal-kunta",
    name: "Tegal Kunta (Falaknuma)",
    year: 2002,
    note: "Where the Yaba story began.",
    mapUrl: "https://maps.google.com/?q=Yaba+Fast+Food+Tegal+Kunta+Hyderabad"
  },
  {
    id: "vattepally",
    name: "Vattepally",
    year: 2008,
    note: "Our second home in the city.",
    mapUrl: "https://maps.google.com/?q=Yaba+Fast+Food+Vattepally+Hyderabad"
  },
  {
    id: "shahalibanda",
    name: "Shahalibanda",
    year: 2022,
    note: "Bringing Yaba to the Old City.",
    mapUrl: "https://maps.google.com/?q=Yaba+Fast+Food+Shahalibanda+Hyderabad"
  },
  {
    id: "babanagar",
    name: "Babanagar",
    year: 2023,
    note: "Another neighbourhood, same taste.",
    mapUrl: "https://maps.google.com/?q=Yaba+Fast+Food+Babanagar+Hyderabad"
  },
  {
    id: "phool-bagh",
    name: "Phool Bagh",
    year: 2024,
    note: "Our newest branch.",
    mapUrl: "https://maps.google.com/?q=Yaba+Fast+Food+Phool+Bagh+Hyderabad"
  }
];

/**
 * Returns branches sorted in ascending order by year.
 */
export const getSortedBranches = () => {
  return [...branchesData].sort((a, b) => a.year - b.year);
};

/**
 * Computes dynamic statistics based on branchesData.
 * Never hardcoded so it remains up-to-date as years advance or branches are added.
 */
export const getBranchStats = () => {
  const sorted = getSortedBranches();
  const currentYear = new Date().getFullYear();
  const foundingYear = sorted.length > 0 ? sorted[0].year : 2002;
  const legacyYears = Math.max(0, currentYear - foundingYear);

  return {
    foundingYear,
    legacyYears,
    branchCount: sorted.length,
    latestIndex: sorted.length - 1
  };
};
