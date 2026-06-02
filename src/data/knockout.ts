// Round of 32 pairing rules based on FIFA 2026 regulations
// Each match shows which team(s) are fixed and which groups' third-place teams can fill the slot

export interface Round32Match {
  id: string;
  matchNumber: number;
  team1Type: "winner" | "runner-up";
  team1Group: string;
  team2Type: "winner" | "runner-up" | "third";
  team2Group?: string; // Fixed group for winner/runner-up
  team2PossibleThirdGroups?: string[]; // Possible groups if team2 is third-place
}

export const ROUND_32_STRUCTURE: Round32Match[] = [
  {
    id: "R32_1",
    matchNumber: 1,
    team1Type: "runner-up",
    team1Group: "A",
    team2Type: "runner-up",
    team2Group: "B",
  },
  {
    id: "R32_2",
    matchNumber: 2,
    team1Type: "winner",
    team1Group: "E",
    team2Type: "third",
    team2PossibleThirdGroups: ["A", "B", "C", "D", "F"],
  },
  {
    id: "R32_3",
    matchNumber: 3,
    team1Type: "winner",
    team1Group: "F",
    team2Type: "runner-up",
    team2Group: "C",
  },
  {
    id: "R32_4",
    matchNumber: 4,
    team1Type: "winner",
    team1Group: "C",
    team2Type: "runner-up",
    team2Group: "F",
  },
  {
    id: "R32_5",
    matchNumber: 5,
    team1Type: "winner",
    team1Group: "I",
    team2Type: "third",
    team2PossibleThirdGroups: ["C", "D", "F", "G", "H"],
  },
  {
    id: "R32_6",
    matchNumber: 6,
    team1Type: "runner-up",
    team1Group: "E",
    team2Type: "runner-up",
    team2Group: "I",
  },
  {
    id: "R32_7",
    matchNumber: 7,
    team1Type: "winner",
    team1Group: "A",
    team2Type: "third",
    team2PossibleThirdGroups: ["C", "E", "F", "H", "I"],
  },
  {
    id: "R32_8",
    matchNumber: 8,
    team1Type: "winner",
    team1Group: "L",
    team2Type: "third",
    team2PossibleThirdGroups: ["E", "H", "I", "J", "K"],
  },
  {
    id: "R32_9",
    matchNumber: 9,
    team1Type: "winner",
    team1Group: "D",
    team2Type: "third",
    team2PossibleThirdGroups: ["B", "E", "F", "I", "J"],
  },
  {
    id: "R32_10",
    matchNumber: 10,
    team1Type: "winner",
    team1Group: "G",
    team2Type: "third",
    team2PossibleThirdGroups: ["A", "E", "H", "I", "J"],
  },
  {
    id: "R32_11",
    matchNumber: 11,
    team1Type: "runner-up",
    team1Group: "K",
    team2Type: "runner-up",
    team2Group: "L",
  },
  {
    id: "R32_12",
    matchNumber: 12,
    team1Type: "winner",
    team1Group: "H",
    team2Type: "runner-up",
    team2Group: "J",
  },
  {
    id: "R32_13",
    matchNumber: 13,
    team1Type: "winner",
    team1Group: "B",
    team2Type: "third",
    team2PossibleThirdGroups: ["E", "F", "G", "I", "J"],
  },
  {
    id: "R32_14",
    matchNumber: 14,
    team1Type: "winner",
    team1Group: "J",
    team2Type: "runner-up",
    team2Group: "H",
  },
  {
    id: "R32_15",
    matchNumber: 15,
    team1Type: "winner",
    team1Group: "K",
    team2Type: "third",
    team2PossibleThirdGroups: ["D", "E", "I", "J", "L"],
  },
  {
    id: "R32_16",
    matchNumber: 16,
    team1Type: "runner-up",
    team1Group: "D",
    team2Type: "runner-up",
    team2Group: "G",
  },
];

// Knockout match types (for all stages after group phase)
export type KnockoutStage = "R32" | "R16" | "QF" | "SF" | "FINAL" | "THIRD";

export interface KnockoutMatch {
  id: string;
  stage: KnockoutStage;
  matchNumber: number;
  homeTeamId: string | null; // null until determined
  awayTeamId: string | null; // null until determined
  homeGoals: number | null;
  awayGoals: number | null;
  homePenalties: number | null; // Only for extra time scenarios
  awayPenalties: number | null;
  winner: string | null;
  status: "pending" | "played";
}

// Bracket structure for all knockout stages
export const KNOCKOUT_STAGES = {
  R32: 16,  // 16 matches
  R16: 8,   // 8 matches (quarterfinals)
  QF: 4,    // 4 matches (quarterfinals)
  SF: 2,    // 2 matches (semifinals)
  FINAL: 1, // 1 match
  THIRD: 1, // 1 match (third place)
} as const;
