import type { Match, StandingRow } from "../types";
import type { GroupId } from "../data/groups";
import { getGroupTeams } from "../data/groups";
import { TEAMS } from "../data/teams";

export function calculateStandings(
  groupId: GroupId,
  matches: Record<string, Match>
): StandingRow[] {
  const teams = getGroupTeams(groupId);

  // Initialize standings for each team
  const standings: Record<string, StandingRow> = {};
  teams.forEach((teamId) => {
    standings[teamId] = {
      teamId,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    };
  });

  // Process only matches for this group that have been played
  Object.values(matches).forEach((match) => {
    if (match.group !== groupId || match.status !== "played") return;

    const homeTeam = standings[match.homeTeam];
    const awayTeam = standings[match.awayTeam];

    if (!homeTeam || !awayTeam) return;

    const homeGoals = match.homeGoals!;
    const awayGoals = match.awayGoals!;

    // Update played count
    homeTeam.played += 1;
    awayTeam.played += 1;

    // Update goals
    homeTeam.goalsFor += homeGoals;
    homeTeam.goalsAgainst += awayGoals;
    awayTeam.goalsFor += awayGoals;
    awayTeam.goalsAgainst += homeGoals;

    // Determine winner/loser/draw and update points
    if (homeGoals > awayGoals) {
      homeTeam.won += 1;
      homeTeam.points += 3;
      awayTeam.lost += 1;
    } else if (awayGoals > homeGoals) {
      awayTeam.won += 1;
      awayTeam.points += 3;
      homeTeam.lost += 1;
    } else {
      homeTeam.drawn += 1;
      homeTeam.points += 1;
      awayTeam.drawn += 1;
      awayTeam.points += 1;
    }
  });

  // Calculate goal difference
  Object.values(standings).forEach((row) => {
    row.goalDiff = row.goalsFor - row.goalsAgainst;
  });

  // Sort by: points desc, goal diff desc, goals for desc, then by original seed order
  const sorted = Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    const teamA = TEAMS[a.teamId];
    const teamB = TEAMS[b.teamId];
    return (teamA?.seed || 4) - (teamB?.seed || 4);
  });

  return sorted;
}
