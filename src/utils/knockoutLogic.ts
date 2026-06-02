import type { Match, KnockoutMatch } from "../types";
import type { GroupId } from "../data/groups";
import { ROUND_32_STRUCTURE } from "../data/knockout";
import { calculateStandings } from "./standings";
import { TEAMS } from "../data/teams";

// Get the 8 best third-place teams sorted by their ranking
export function getBestThirdPlaces(matches: Record<string, Match>) {
  const thirdPlaces = Object.values(TEAMS).reduce(
    (acc, team) => {
      const group = team.group as GroupId;
      const groupMatchesArray = Object.values(matches).filter((m) => m.group === group);
      const groupMatchesRecord = groupMatchesArray.reduce(
        (rec, m) => ({ ...rec, [m.id]: m }),
        {} as Record<string, Match>
      );
      const standings = calculateStandings(group, groupMatchesRecord);
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
    const group = team.group as GroupId;
    if (!groupStandings[group]) {
      const groupMatchesArray = Object.values(matches).filter((m) => m.group === group);
      const groupMatchesRecord = groupMatchesArray.reduce(
        (rec, m) => ({ ...rec, [m.id]: m }),
        {} as Record<string, Match>
      );
      groupStandings[group] = calculateStandings(group, groupMatchesRecord);
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
  if (match.homeGoals === null || match.awayGoals === null) return null;

  if (match.homeGoals > match.awayGoals) {
    return match.homeTeamId;
  } else if (match.awayGoals > match.homeGoals) {
    return match.awayTeamId;
  } else {
    // Draw - check for penalties
    if (
      match.homePenalties !== null &&
      match.awayPenalties !== null
    ) {
      return match.homePenalties > match.awayPenalties
        ? match.homeTeamId
        : match.awayTeamId;
    }
    // If no penalties yet, it's still pending
    return null;
  }
}

// Advance winners from one stage to the next
export function progressKnockout(
  knockoutMatches: Record<string, KnockoutMatch>
): Record<string, KnockoutMatch> {
  const currentMatches = { ...knockoutMatches };
  const r32Matches = Object.values(currentMatches).filter((m) => m.stage === "R32");
  const r16Matches = Object.values(currentMatches).filter((m) => m.stage === "R16");
  const qfMatches = Object.values(currentMatches).filter((m) => m.stage === "QF");
  const sfMatches = Object.values(currentMatches).filter((m) => m.stage === "SF");

  // Check if all R32 matches are played, if so create R16
  const allR32Played = r32Matches.length === 16 && r32Matches.every((m) => m.winner);
  if (allR32Played && r16Matches.length === 0) {
    const winners = r32Matches
      .sort((a, b) => a.matchNumber - b.matchNumber)
      .map((m) => m.winner!);

    for (let i = 0; i < 8; i++) {
      const matchId = `R16_${i + 1}`;
      currentMatches[matchId] = {
        id: matchId,
        stage: "R16",
        matchNumber: i + 1,
        homeTeamId: winners[i * 2] || null,
        awayTeamId: winners[i * 2 + 1] || null,
        homeGoals: null,
        awayGoals: null,
        homePenalties: null,
        awayPenalties: null,
        winner: null,
        status: "pending",
      };
    }
  }

  // Check if all R16 matches are played, if so create QF
  if (r16Matches.length === 8 && r16Matches.every((m) => m.winner)) {
    const winners = r16Matches
      .sort((a, b) => a.matchNumber - b.matchNumber)
      .map((m) => m.winner!);
    const qfCount = Object.values(currentMatches).filter((m) => m.stage === "QF").length;

    if (qfCount === 0) {
      for (let i = 0; i < 4; i++) {
        const matchId = `QF_${i + 1}`;
        currentMatches[matchId] = {
          id: matchId,
          stage: "QF",
          matchNumber: i + 1,
          homeTeamId: winners[i * 2] || null,
          awayTeamId: winners[i * 2 + 1] || null,
          homeGoals: null,
          awayGoals: null,
          homePenalties: null,
          awayPenalties: null,
          winner: null,
          status: "pending",
        };
      }
    }
  }

  // Check if all QF matches are played, if so create SF
  if (qfMatches.length === 4 && qfMatches.every((m) => m.winner)) {
    const winners = qfMatches
      .sort((a, b) => a.matchNumber - b.matchNumber)
      .map((m) => m.winner!);
    const sfCount = Object.values(currentMatches).filter((m) => m.stage === "SF").length;

    if (sfCount === 0) {
      for (let i = 0; i < 2; i++) {
        const matchId = `SF_${i + 1}`;
        currentMatches[matchId] = {
          id: matchId,
          stage: "SF",
          matchNumber: i + 1,
          homeTeamId: winners[i * 2] || null,
          awayTeamId: winners[i * 2 + 1] || null,
          homeGoals: null,
          awayGoals: null,
          homePenalties: null,
          awayPenalties: null,
          winner: null,
          status: "pending",
        };
      }
    }
  }

  // Check if all SF matches are played, if so create Final and Third Place
  if (sfMatches.length === 2 && sfMatches.every((m) => m.winner)) {
    const sf1Winner = sfMatches.find((m) => m.matchNumber === 1)?.winner;
    const sf2Winner = sfMatches.find((m) => m.matchNumber === 2)?.winner;
    const sf1Loser = sfMatches.find((m) => m.matchNumber === 1)?.homeTeamId === sf1Winner
      ? sfMatches.find((m) => m.matchNumber === 1)?.awayTeamId
      : sfMatches.find((m) => m.matchNumber === 1)?.homeTeamId;
    const sf2Loser = sfMatches.find((m) => m.matchNumber === 2)?.homeTeamId === sf2Winner
      ? sfMatches.find((m) => m.matchNumber === 2)?.awayTeamId
      : sfMatches.find((m) => m.matchNumber === 2)?.homeTeamId;

    const finalCount = Object.values(currentMatches).filter((m) => m.stage === "FINAL").length;
    if (finalCount === 0 && sf1Winner && sf2Winner) {
      currentMatches["FINAL_1"] = {
        id: "FINAL_1",
        stage: "FINAL",
        matchNumber: 1,
        homeTeamId: sf1Winner,
        awayTeamId: sf2Winner,
        homeGoals: null,
        awayGoals: null,
        homePenalties: null,
        awayPenalties: null,
        winner: null,
        status: "pending",
      };
    }

    const thirdCount = Object.values(currentMatches).filter((m) => m.stage === "THIRD").length;
    if (thirdCount === 0 && sf1Loser && sf2Loser) {
      currentMatches["THIRD_1"] = {
        id: "THIRD_1",
        stage: "THIRD",
        matchNumber: 1,
        homeTeamId: sf1Loser,
        awayTeamId: sf2Loser,
        homeGoals: null,
        awayGoals: null,
        homePenalties: null,
        awayPenalties: null,
        winner: null,
        status: "pending",
      };
    }
  }

  return currentMatches;
}
