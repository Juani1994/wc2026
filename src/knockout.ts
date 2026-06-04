// Knockout bracket builder for FIFA World Cup 2026.
//
// Round of 32 is half-fixed (winner-vs-runner-up matchups + intra-runner-up matches)
// and half-dynamic (8 winner-vs-third matches, where the third opponent is
// determined by which 8 groups produce the best third-placed teams).
//
// The dynamic part is resolved through THIRD_PLACE_MAPPING — an official lookup
// table with 495 entries (one per C(12,8) combination). Source: Wikipedia,
// "Template:2026 FIFA World Cup third-place table".

import type { Match, KnockoutMatch, KnockoutStage } from "./types";
import type { GroupId } from "./data/groups";
import { GROUP_IDS } from "./data/groups";
import { calculateStandings } from "./utils/standings";
import { THIRD_PLACE_MAPPING, WINNER_SLOTS } from "./thirdPlaceMapping";

// ---- Types ----------------------------------------------------------------

export type SlotKind = "1" | "2" | "3";

export interface SlotRef {
  // "1A" = winner of A, "2B" = runner-up of B, "3F" = third of F.
  // Used for display/labels and for computing team IDs from standings.
  kind: SlotKind;
  group: string;
}

export interface BracketMatch {
  id: string;
  stage: KnockoutStage;
  matchNumber: number;
  fifaMatchNumber: number; // FIFA's official numbering (73..100, etc.)
  homeSlot: SlotRef | null;
  awaySlot: SlotRef | null;
  homeTeamId: string | null;
  awayTeamId: string | null;
}

// ---- Constants ------------------------------------------------------------

// R32 matches in bracket-order: pairs (i*2, i*2+1) feed R16_{i+1}.
// homeSlot/awaySlot use "third" or a real group reference; for "third" we look
// up the opponent group via THIRD_PLACE_MAPPING.
type SlotTemplate =
  | { tag: "fixed"; kind: "1" | "2"; group: string }
  | { tag: "third-of"; winnerSlot: string };

interface R32Template {
  fifa: number;
  home: SlotTemplate;
  away: SlotTemplate;
}

const fixed = (kind: "1" | "2", group: string): SlotTemplate => ({
  tag: "fixed",
  kind,
  group,
});
const thirdOf = (winnerSlot: string): SlotTemplate => ({
  tag: "third-of",
  winnerSlot,
});

const R32_TEMPLATES: R32Template[] = [
  // R16_1
  { fifa: 74, home: fixed("1", "E"), away: thirdOf("1E") },
  { fifa: 77, home: fixed("1", "I"), away: thirdOf("1I") },
  // R16_2
  { fifa: 73, home: fixed("2", "A"), away: fixed("2", "B") },
  { fifa: 75, home: fixed("1", "F"), away: fixed("2", "C") },
  // R16_5
  { fifa: 83, home: fixed("2", "K"), away: fixed("2", "L") },
  { fifa: 84, home: fixed("1", "H"), away: fixed("2", "J") },
  // R16_6
  { fifa: 81, home: fixed("1", "D"), away: thirdOf("1D") },
  { fifa: 82, home: fixed("1", "G"), away: thirdOf("1G") },
  // R16_3
  { fifa: 76, home: fixed("1", "C"), away: fixed("2", "F") },
  { fifa: 78, home: fixed("2", "E"), away: fixed("2", "I") },
  // R16_4
  { fifa: 79, home: fixed("1", "A"), away: thirdOf("1A") },
  { fifa: 80, home: fixed("1", "L"), away: thirdOf("1L") },
  // R16_7
  { fifa: 86, home: fixed("1", "J"), away: fixed("2", "H") },
  { fifa: 88, home: fixed("2", "D"), away: fixed("2", "G") },
  // R16_8
  { fifa: 85, home: fixed("1", "B"), away: thirdOf("1B") },
  { fifa: 87, home: fixed("1", "K"), away: thirdOf("1K") },
];

const R16_FIFA_START = 89;
const QF_FIFA_START = 97;
const SF_FIFA_START = 101;

// ---- Standings helpers ----------------------------------------------------

export interface GroupStandingsSnapshot {
  standings: Record<string, ReturnType<typeof calculateStandings>>;
  allGroupsComplete: boolean;
}

export function computeAllStandings(matches: Record<string, Match>): GroupStandingsSnapshot {
  const standings: Record<string, ReturnType<typeof calculateStandings>> = {};
  let allComplete = true;
  for (const groupId of GROUP_IDS) {
    const s = calculateStandings(groupId as GroupId, matches);
    standings[groupId] = s;
    const groupMatches = Object.values(matches).filter((m) => m.group === groupId);
    if (groupMatches.some((m) => m.status !== "played")) {
      allComplete = false;
    }
  }
  return { standings, allGroupsComplete: allComplete };
}

export interface BestThird {
  groupId: string;
  teamId: string;
  points: number;
  goalDiff: number;
  goalsFor: number;
}

export function getBestEightThirds(
  standings: Record<string, ReturnType<typeof calculateStandings>>
): BestThird[] {
  const thirds: BestThird[] = [];
  for (const groupId of GROUP_IDS) {
    const row = standings[groupId]?.[2];
    if (!row) continue;
    thirds.push({
      groupId,
      teamId: row.teamId,
      points: row.points,
      goalDiff: row.goalDiff,
      goalsFor: row.goalsFor,
    });
  }
  thirds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
    return b.goalsFor - a.goalsFor;
  });
  return thirds.slice(0, 8);
}

export function buildComboKey(thirds: BestThird[]): string {
  return thirds
    .map((t) => t.groupId)
    .sort()
    .join("");
}

// ---- Bracket builder ------------------------------------------------------

export interface BuildResult {
  bracket: BracketMatch[]; // R32 only, ordered by matchNumber 1..16
  comboKey: string | null;
  comboIndex: number | null; // 1-based index into THIRD_PLACE_MAPPING
  bestThirds: BestThird[];
  hasValidCombo: boolean;
}

export function buildRoundOf32Bracket(matches: Record<string, Match>): BuildResult {
  const { standings } = computeAllStandings(matches);
  const bestThirds = getBestEightThirds(standings);

  let comboKey: string | null = null;
  let comboIndex: number | null = null;
  let opponentsByWinnerSlot: Record<string, string> = {};
  let hasValidCombo = false;

  if (bestThirds.length === 8) {
    comboKey = buildComboKey(bestThirds);
    const opponents = THIRD_PLACE_MAPPING[comboKey];
    if (opponents) {
      hasValidCombo = true;
      WINNER_SLOTS.forEach((slot, i) => {
        opponentsByWinnerSlot[slot] = opponents[i];
      });
      const allKeys = Object.keys(THIRD_PLACE_MAPPING);
      comboIndex = allKeys.indexOf(comboKey) + 1 || null;
    }
  }

  const thirdsByGroup: Record<string, string> = {};
  bestThirds.forEach((t) => {
    thirdsByGroup[t.groupId] = t.teamId;
  });

  const bracket: BracketMatch[] = R32_TEMPLATES.map((t, idx) => {
    const matchNumber = idx + 1;
    const homeSlot = resolveSlot(t.home, opponentsByWinnerSlot);
    const awaySlot = resolveSlot(t.away, opponentsByWinnerSlot);

    return {
      id: `R32_${matchNumber}`,
      stage: "R32",
      matchNumber,
      fifaMatchNumber: t.fifa,
      homeSlot,
      awaySlot,
      homeTeamId: resolveTeamId(homeSlot, standings, thirdsByGroup),
      awayTeamId: resolveTeamId(awaySlot, standings, thirdsByGroup),
    };
  });

  return { bracket, comboKey, comboIndex, bestThirds, hasValidCombo };
}

function resolveSlot(
  ref: SlotTemplate,
  opponentsByWinnerSlot: Record<string, string>
): SlotRef | null {
  if (ref.tag === "third-of") {
    const oppGroup = opponentsByWinnerSlot[ref.winnerSlot];
    if (!oppGroup) return null;
    return { kind: "3", group: oppGroup };
  }
  return { kind: ref.kind, group: ref.group };
}

function resolveTeamId(
  slot: SlotRef | null,
  standings: Record<string, ReturnType<typeof calculateStandings>>,
  thirdsByGroup: Record<string, string>
): string | null {
  if (!slot) return null;
  if (slot.kind === "3") {
    return thirdsByGroup[slot.group] ?? null;
  }
  const positionIdx = slot.kind === "1" ? 0 : 1;
  return standings[slot.group]?.[positionIdx]?.teamId ?? null;
}

// ---- Full bracket (R32 → R16 → QF → SF → Third/Final) ---------------------

export function buildFullKnockoutBracket(
  matches: Record<string, Match>,
  existing: Record<string, KnockoutMatch>
): Record<string, KnockoutMatch> {
  const { bracket } = buildRoundOf32Bracket(matches);
  const result: Record<string, KnockoutMatch> = {};

  // 1. Build R32 matches, preserving any user-entered scores where the pairing
  //    is unchanged. If the pairing changes (different teams), reset scores.
  for (const m of bracket) {
    const prior = existing[m.id];
    const sameTeams =
      prior &&
      prior.homeTeamId === m.homeTeamId &&
      prior.awayTeamId === m.awayTeamId &&
      m.homeTeamId !== null &&
      m.awayTeamId !== null;

    result[m.id] = {
      id: m.id,
      stage: "R32",
      matchNumber: m.matchNumber,
      homeTeamId: m.homeTeamId,
      awayTeamId: m.awayTeamId,
      homeGoals: sameTeams ? prior!.homeGoals : null,
      awayGoals: sameTeams ? prior!.awayGoals : null,
      homePenalties: sameTeams ? prior!.homePenalties : null,
      awayPenalties: sameTeams ? prior!.awayPenalties : null,
      winner: sameTeams ? prior!.winner : null,
      status: sameTeams ? prior!.status : "pending",
    };
  }

  // 2. R16 through Final: derive feeder team IDs from previous round, then
  //    rebuild each match while preserving scores when both feeders point to
  //    the same teams as before.
  buildDownstreamStage(result, existing, "R16", 8, "R32", R16_FIFA_START);
  buildDownstreamStage(result, existing, "QF", 4, "R16", QF_FIFA_START);
  buildDownstreamStage(result, existing, "SF", 2, "QF", SF_FIFA_START);

  // Third place and Final from the two SF matches.
  const sf1 = result["SF_1"];
  const sf2 = result["SF_2"];
  if (sf1 && sf2) {
    const finalHome = sf1.winner;
    const finalAway = sf2.winner;
    const thirdHome = sf1.winner ? loserOf(sf1) : null;
    const thirdAway = sf2.winner ? loserOf(sf2) : null;

    upsertMatch(result, existing, {
      id: "FINAL_1",
      stage: "FINAL",
      matchNumber: 1,
      homeTeamId: finalHome,
      awayTeamId: finalAway,
    });
    upsertMatch(result, existing, {
      id: "THIRD_1",
      stage: "THIRD",
      matchNumber: 1,
      homeTeamId: thirdHome,
      awayTeamId: thirdAway,
    });
  }

  return result;
}

function buildDownstreamStage(
  result: Record<string, KnockoutMatch>,
  existing: Record<string, KnockoutMatch>,
  stage: KnockoutStage,
  count: number,
  prevStage: KnockoutStage,
  _fifaStart: number
) {
  for (let i = 1; i <= count; i++) {
    const left = result[`${prevStage}_${i * 2 - 1}`];
    const right = result[`${prevStage}_${i * 2}`];
    const homeTeamId = left?.winner ?? null;
    const awayTeamId = right?.winner ?? null;

    upsertMatch(result, existing, {
      id: `${stage}_${i}`,
      stage,
      matchNumber: i,
      homeTeamId,
      awayTeamId,
    });
  }
}

function upsertMatch(
  result: Record<string, KnockoutMatch>,
  existing: Record<string, KnockoutMatch>,
  base: {
    id: string;
    stage: KnockoutStage;
    matchNumber: number;
    homeTeamId: string | null;
    awayTeamId: string | null;
  }
) {
  const prior = existing[base.id];
  const sameTeams =
    prior &&
    prior.homeTeamId === base.homeTeamId &&
    prior.awayTeamId === base.awayTeamId &&
    base.homeTeamId !== null &&
    base.awayTeamId !== null;

  result[base.id] = {
    ...base,
    homeGoals: sameTeams ? prior!.homeGoals : null,
    awayGoals: sameTeams ? prior!.awayGoals : null,
    homePenalties: sameTeams ? prior!.homePenalties : null,
    awayPenalties: sameTeams ? prior!.awayPenalties : null,
    winner: sameTeams ? prior!.winner : null,
    status: sameTeams ? prior!.status : "pending",
  };
}

function loserOf(m: KnockoutMatch): string | null {
  if (!m.winner) return null;
  return m.winner === m.homeTeamId ? m.awayTeamId : m.homeTeamId;
}

// ---- Public helpers used by the UI ---------------------------------------

export function getComboIndex(comboKey: string | null): number | null {
  if (!comboKey) return null;
  const keys = Object.keys(THIRD_PLACE_MAPPING);
  const idx = keys.indexOf(comboKey);
  return idx >= 0 ? idx + 1 : null;
}
