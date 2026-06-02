import type { Match } from "../types";

// Group compositions in official draw order
const GROUPS = {
  A: ["MEX", "ZAF", "KOR", "CZE"],
  B: ["CAN", "BIH", "QAT", "CHE"],
  C: ["BRA", "MAR", "HTI", "SCO"],
  D: ["USA", "PRY", "AUS", "TUR"],
  E: ["GER", "CUW", "CIV", "ECU"],
  F: ["NED", "JPN", "SWE", "TUN"],
  G: ["BEL", "EGY", "IRN", "NZL"],
  H: ["ESP", "CPV", "SAU", "URU"],
  I: ["FRA", "SEN", "IRQ", "NOR"],
  J: ["ARG", "DZA", "AUT", "JOR"],
  K: ["POR", "COD", "UZB", "COL"],
  L: ["ENG", "HRV", "GHA", "PAN"],
};

export type GroupId = keyof typeof GROUPS;

export const GROUP_IDS = Object.keys(GROUPS) as GroupId[];

// Standard fixture pattern for 4-team group:
// Matchday 1: 1 vs 2, 3 vs 4
// Matchday 2: 1 vs 3, 2 vs 4
// Matchday 3: 1 vs 4, 2 vs 3

function generateGroupMatches(groupId: GroupId): Match[] {
  const teams = GROUPS[groupId];
  const [team1, team2, team3, team4] = teams;
  let matchNumber = 0;

  const matches: Match[] = [
    // Matchday 1
    {
      id: `${groupId}_1_${++matchNumber}`,
      group: groupId,
      matchday: 1,
      homeTeam: team1,
      awayTeam: team2,
      homeGoals: null,
      awayGoals: null,
      status: "pending",
    },
    {
      id: `${groupId}_1_${++matchNumber}`,
      group: groupId,
      matchday: 1,
      homeTeam: team3,
      awayTeam: team4,
      homeGoals: null,
      awayGoals: null,
      status: "pending",
    },
    // Matchday 2
    {
      id: `${groupId}_2_${++matchNumber}`,
      group: groupId,
      matchday: 2,
      homeTeam: team1,
      awayTeam: team3,
      homeGoals: null,
      awayGoals: null,
      status: "pending",
    },
    {
      id: `${groupId}_2_${++matchNumber}`,
      group: groupId,
      matchday: 2,
      homeTeam: team2,
      awayTeam: team4,
      homeGoals: null,
      awayGoals: null,
      status: "pending",
    },
    // Matchday 3
    {
      id: `${groupId}_3_${++matchNumber}`,
      group: groupId,
      matchday: 3,
      homeTeam: team1,
      awayTeam: team4,
      homeGoals: null,
      awayGoals: null,
      status: "pending",
    },
    {
      id: `${groupId}_3_${++matchNumber}`,
      group: groupId,
      matchday: 3,
      homeTeam: team2,
      awayTeam: team3,
      homeGoals: null,
      awayGoals: null,
      status: "pending",
    },
  ];

  return matches;
}

// Generate all matches for all groups
export function generateAllMatches(): Record<string, Match> {
  const matches: Record<string, Match> = {};
  GROUP_IDS.forEach((groupId) => {
    generateGroupMatches(groupId).forEach((match) => {
      matches[match.id] = match;
    });
  });
  return matches;
}

export function getGroupTeams(groupId: GroupId): string[] {
  return GROUPS[groupId];
}
