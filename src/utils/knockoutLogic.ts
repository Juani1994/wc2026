import type { Match, KnockoutMatch } from "../types";
import { ROUND_32_STRUCTURE, KNOCKOUT_STAGES } from "../data/knockout";
import { calculateStandings } from "./standings";
import { TEAMS } from "../data/teams";

// Get the 8 best third-place teams sorted by their ranking
export function getBestThirdPlaces(matches: Record<string, Match>) {
  const thirdPlaces = Object.values(TEAMS).reduce(
    (acc, team) => {
      const group = team.group;
      const groupMatches = Object.values(matches).filter((m) => m.group === group);
      const standings = calculateStandings(group, groupMatches);
      if (standings[2]) {
        acc.push({ ...standings[2], group });
      }
      return acc;
    },
    [] as (any)[]
  );

  // Sort by points, goal diff, goals for (same logic as calculateStandings)
  return thirdPlaces
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      return b.goalsFor - a.goalsFor;
    })
    .slice(0, 8);
}

// Assign third-place teams to Round of 32 slots
export function assignThirdsToRound32(
  thirdPlaces: any[]
): Record<string, string | null> {
  const assignment: Record<string, string | null> = {};

  // Get all third-place slots (matches with team2Type === "third")
  const thirdSlots = ROUND_32_STRUCTURE.filter((m) => m.team2Type === "third");

  // Assign each third-place team to a valid slot
  const usedThirds = new Set<string>();

  for (const slot of thirdSlots) {
    // Find the best available third that can go in this slot
    for (const third of thirdPlaces) {
      if (
        !usedThirds.has(third.teamId) &&
        slot.team2PossibleThirdGroups?.includes(third.group)
      ) {
        assignment[slot.id] = third.teamId;
        usedThirds.add(third.teamId);
        break;
      }
    }
  }

  return assignment;
}

// Initialize all knockout matches for Round of 32
export function initializeRound32Matches(
  matches: Record<string, Match>,
  thirdAssignment: Record<string, string | null>
): Record<string, KnockoutMatch> {
  const knockoutMatches: Record<string, KnockoutMatch> = {};

  // Get group winners and runners-up
  const groupStandings: Record<string, any[]> = {};
  Object.keys(TEAMS).forEach((teamId) => {
    const team = TEAMS[teamId];
    const group = team.group;
    if (!groupStandings[group]) {
      const groupMatches = Object.values(matches).filter((m) => m.group === group);
      groupStandings[group] = calculateStandings(group, groupMatches);
    }
  });

  // Create matches from ROUND_32_STRUCTURE
  ROUND_32_STRUCTURE.forEach((matchRule) => {
    let homeTeamId: string | null = null;
    let awayTeamId: string | null = null;

    // Assign team 1
    if (matchRule.team1Type === "winner") {
      homeTeamId = groupStandings[matchRule.team1Group]?.[0]?.teamId || null;
    } else if (matchRule.team1Type === "runner-up") {
      homeTeamId = groupStandings[matchRule.team1Group]?.[1]?.teamId || null;
    }

    // Assign team 2
    if (matchRule.team2Type === "winner") {
      awayTeamId = groupStandings[matchRule.team2Group!]?.[0]?.teamId || null;
    } else if (matchRule.team2Type === "runner-up") {
      awayTeamId = groupStandings[matchRule.team2Group!]?.[1]?.teamId || null;
    } else if (matchRule.team2Type === "third") {
      awayTeamId = thirdAssignment[matchRule.id] || null;
    }

    knockoutMatches[matchRule.id] = {
      id: matchRule.id,
      stage: "R32",
      matchNumber: matchRule.matchNumber,
      homeTeamId,
      awayTeamId,
      homeGoals: null,
      awayGoals: null,
      homePenalties: null,
      awayPenalties: null,
      winner: null,
      status: "pending",
    };
  });

  return knockoutMatches;
}

// Determine winner and advance to next round
export function determineWinner(
  match: KnockoutMatch
): string | null {
  if (!match.homeGoals || match.awayGoals === null) return null;

  if (match.homeGoals > match.awayGoals) {
    return match.homeTeamId;
  } else if (match.awayGoals > match.homeGoals) {
    return match.awayTeamId;
  } else {
    // Draw - check for penalties
    if (match.homePenalties && match.awayPenalties) {
      return match.homePenalties > match.awayPenalties
        ? match.homeTeamId
        : match.awayTeamId;
    }
    // If no penalties yet, it's still pending
    return null;
  }
}
