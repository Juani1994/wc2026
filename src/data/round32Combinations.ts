// All 495 valid Round of 32 combinations from FIFA 2026 regulations
// Each combination defines: which 8 groups have third-place teams,
// and which first-place team plays against which third-place group

export interface R32Combination {
  thirds: string[]; // 8 groups that have advancing third-place teams
  matchups: Array<{
    firstGroup: string; // Winner of this group
    thirdGroup: string; // Third-place team from this group
  }>;
}

// Example: Combination 330 from Wikipedia
// Thirds from: A B D F G H J L
// Winners 1A, 1B, 1D, 1E, 1G, 1I, 1K, 1L vs Thirds 3H, 3J, 3B, 3D, 3A, 3F, 3L, 3K
export const R32_COMBINATIONS: R32Combination[] = [
  {
    thirds: ["A", "B", "D", "F", "G", "H", "J", "L"],
    matchups: [
      { firstGroup: "A", thirdGroup: "H" },
      { firstGroup: "B", thirdGroup: "J" },
      { firstGroup: "D", thirdGroup: "B" },
      { firstGroup: "E", thirdGroup: "D" },
      { firstGroup: "G", thirdGroup: "A" },
      { firstGroup: "I", thirdGroup: "F" },
      { firstGroup: "K", thirdGroup: "L" },
      { firstGroup: "L", thirdGroup: "K" },
    ],
  },
  // TODO: Add remaining 494 combinations from Wikipedia
  // This is a simplified example - the full implementation needs
  // all 495 valid combinations extracted from the Wikipedia table
];

// Helper function to find the combination for selected thirds
export function findCombination(thirdGroups: string[]): R32Combination | null {
  const sortedThirds = [...thirdGroups].sort();
  const combination = R32_COMBINATIONS.find(
    (c) => c.thirds.length === 8 &&
           c.thirds.every((g, i) => g === sortedThirds[i])
  );
  return combination || null;
}

export function getCombinationIndex(thirdGroups: string[]): number {
  const combination = findCombination(thirdGroups);
  if (!combination) return 0;
  return R32_COMBINATIONS.indexOf(combination) + 1;
}
