import { TEAMS } from "../data/teams";

// Generate a realistic match result based on FIFA ranking difference
export function generateMatchResult(
  homeTeamId: string,
  awayTeamId: string
): { homeGoals: number; awayGoals: number } {
  const homeTeam = TEAMS[homeTeamId];
  const awayTeam = TEAMS[awayTeamId];

  // Calculate ranking difference (positive = home team stronger)
  const rankingDiff = homeTeam.fifaRanking - awayTeam.fifaRanking;

  // Normalize difference to win probability
  // ~500 point diff = ~65-70% win rate, ~300 point diff = ~60% win rate, ~100 point diff = ~52% win rate
  const winProbability = 0.5 + (rankingDiff / 1000) * 0.25;

  // Determine match outcome based on probabilities
  const resultRand = Math.random();

  let homeGoals: number;
  let awayGoals: number;

  // Win probabilities based on strength difference
  if (resultRand < winProbability) {
    // Home team wins
    const winMargin = Math.random();
    if (winMargin < 0.45) {
      // 1-0 win (most common)
      homeGoals = 1;
      awayGoals = 0;
    } else if (winMargin < 0.80) {
      // 2-0 or 2-1 wins
      homeGoals = 2;
      awayGoals = Math.random() < 0.4 ? 1 : 0;
    } else if (winMargin < 0.95) {
      // 3+ goal wins (rare)
      homeGoals = 3 + (Math.random() < 0.3 ? 1 : 0);
      awayGoals = Math.random() < 0.2 ? 1 : 0;
    } else {
      // Dominant win
      homeGoals = 4;
      awayGoals = 0;
    }
  } else if (resultRand < winProbability + 0.15) {
    // Draw (15% base probability, adjusted by ranking)
    const drawType = Math.random();
    if (drawType < 0.5) {
      homeGoals = 0;
      awayGoals = 0;
    } else if (drawType < 0.85) {
      homeGoals = 1;
      awayGoals = 1;
    } else {
      homeGoals = 2;
      awayGoals = 2;
    }
  } else {
    // Away team wins
    const awayWinProb = 1 - winProbability;
    const winMargin = Math.random();
    if (winMargin < 0.45) {
      // 0-1 win
      homeGoals = 0;
      awayGoals = 1;
    } else if (winMargin < 0.80) {
      // 0-2 or 1-2 wins
      awayGoals = 2;
      homeGoals = Math.random() < 0.4 ? 1 : 0;
    } else if (winMargin < 0.95) {
      // 0-3 or 1-3 wins (rare)
      awayGoals = 3 + (Math.random() < 0.3 ? 1 : 0);
      homeGoals = Math.random() < 0.2 ? 1 : 0;
    } else {
      // Dominant away win
      awayGoals = 4;
      homeGoals = 0;
    }
  }

  return { homeGoals, awayGoals };
}
