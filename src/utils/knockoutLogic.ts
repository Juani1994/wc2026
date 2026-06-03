import type { KnockoutMatch } from "../types";

// Determines the winner of a knockout match. Returns null if undecided
// (no score, or a draw without penalties recorded).
export function determineWinner(match: KnockoutMatch): string | null {
  if (match.homeGoals === null || match.awayGoals === null) return null;

  if (match.homeGoals > match.awayGoals) {
    return match.homeTeamId;
  }
  if (match.awayGoals > match.homeGoals) {
    return match.awayTeamId;
  }

  // Draw — penalties required to decide.
  if (match.homePenalties !== null && match.awayPenalties !== null) {
    return match.homePenalties > match.awayPenalties
      ? match.homeTeamId
      : match.awayTeamId;
  }
  return null;
}
