export interface Team {
  id: string; // ISO 3166-1 alpha-3 code
  name: string;
  group: string;
  seed: 1 | 2 | 3 | 4; // position in group (determines fixtures)
  fifaRanking: number; // FIFA world ranking (1-48 in this tournament)
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

export type ThirdPlace = StandingRow;

export type KnockoutStage = "R32" | "R16" | "QF" | "SF" | "FINAL" | "THIRD";
export type KnockoutMatchStatus = "pending" | "played" | "awarded";

export interface KnockoutMatch {
  id: string;
  stage: KnockoutStage;
  matchNumber: number;
  homeTeamId: string | null; // null until determined
  awayTeamId: string | null; // null until determined
  homeGoals: number | null;
  awayGoals: number | null;
  homePenalties: number | null; // Only if penalties taken
  awayPenalties: number | null;
  winner: string | null; // Team ID of winner
  status: KnockoutMatchStatus;
}

export interface AppState {
  matches: Record<string, Match>;
  knockoutMatches: Record<string, KnockoutMatch>;
  updateMatch: (id: string, homeGoals: number, awayGoals: number) => void;
  updateKnockoutMatch: (
    id: string,
    homeGoals: number,
    awayGoals: number,
    homePenalties?: number,
    awayPenalties?: number
  ) => void;
  resetGroup: (group: string) => void;
  resetAll: () => void;
  initializeKnockout: () => void;
}
