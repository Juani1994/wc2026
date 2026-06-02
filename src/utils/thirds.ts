import type { StandingRow } from "../types";
import { GROUP_IDS } from "../data/groups";
import { calculateStandings } from "./standings";

export interface ThirdPlace extends StandingRow {
  groupId: string;
}

export function getThirdPlaces(matches: Record<string, any>): ThirdPlace[] {
  const thirds: ThirdPlace[] = [];

  GROUP_IDS.forEach((groupId) => {
    const standings = calculateStandings(groupId, matches);
    if (standings.length >= 3) {
      const third = standings[2];
      thirds.push({
        ...third,
        groupId,
      });
    }
  });

  // Sort by points desc, then goal diff, then goals for
  return thirds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    return b.goalsFor - a.goalsFor;
  });
}
