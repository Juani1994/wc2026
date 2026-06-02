export interface Team {
  id: string; // ISO 3166-1 alpha-3 code
  name: string;
  group: string;
  seed: 1 | 2 | 3 | 4; // position in group (determines fixtures)
}

export type MatchStatus = "pending" | "played";

export interface Match {
  id: string; // format: "A_1_1" (group_matchday_matchnumber)
  group: string; // "A" to "L"
  matchday: 1 | 2 | 3;
  homeTeam: string; // team ISO code
  awayTeam: string; // team ISO code
  homeGoals: number | null;
  awayGoals: number | null;
  status: MatchStatus;
}

export interface StandingRow {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

export interface AppState {
  matches: Record<string, Match>;
  updateMatch: (id: string, homeGoals: number, awayGoals: number) => void;
  resetGroup: (group: string) => void;
  resetAll: () => void;
}
