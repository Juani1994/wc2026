import { create } from "zustand";
import type { Match, KnockoutMatch } from "../types";
import { generateAllMatches } from "../data/groups";
import { generateMatchResult } from "../utils/randomMatch";
import { decodeStateFromUrl } from "../utils/shareState";
import { determineWinner } from "../utils/knockoutLogic";
import { buildFullKnockoutBracket, buildRoundOf32Bracket } from "../knockout";

const STORAGE_KEY = "wc2026_state";
const KNOCKOUT_STORAGE_KEY = "wc2026_knockout";

interface State {
  matches: Record<string, Match>;
  knockoutMatches: Record<string, KnockoutMatch>;
  bestThirdPlaces: { groupId: string; teamId: string }[];
  combinationIndex: number | null;
  comboKey: string | null;
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
  resetKnockout: () => void;
  randomizeGroup: (group: string) => void;
  initializeKnockout: () => void;
}

const initialMatches = generateAllMatches();

const useStore = create<State>((set, get) => {
  const loadFromStorage = (): Record<string, Match> => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const encodedState = params.get("predictions");
      if (encodedState) {
        const decoded = decodeStateFromUrl(encodedState);
        if (decoded && Object.keys(decoded).length > 0) {
          const merged = { ...initialMatches };
          Object.entries(decoded).forEach(([id, data]) => {
            if (merged[id]) {
              merged[id] = {
                ...merged[id],
                homeGoals: (data as any).homeGoals,
                awayGoals: (data as any).awayGoals,
                status: "played" as const,
              };
            }
          });
          return merged;
        }
      }
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to load from localStorage:", e);
      }
    }
    return initialMatches;
  };

  const saveToStorage = (matches: Record<string, Match>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  };

  const loadKnockoutFromStorage = (): Record<string, KnockoutMatch> => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(KNOCKOUT_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Failed to load knockout from localStorage:", e);
        }
      }
    }
    return {};
  };

  const saveKnockoutToStorage = (k: Record<string, KnockoutMatch>) =>
    localStorage.setItem(KNOCKOUT_STORAGE_KEY, JSON.stringify(k));

  // Rebuild the knockout bracket from the current group state, preserving any
  // user-entered scores where the pairing is unchanged.
  const rebuildKnockout = (
    matches: Record<string, Match>,
    existing: Record<string, KnockoutMatch>
  ) => {
    const knockoutMatches = buildFullKnockoutBracket(matches, existing);
    const { bestThirds, comboKey, comboIndex } = buildRoundOf32Bracket(matches);
    return {
      knockoutMatches,
      bestThirdPlaces: bestThirds.map((t) => ({ groupId: t.groupId, teamId: t.teamId })),
      comboKey,
      combinationIndex: comboIndex,
    };
  };

  const initialStoredKnockout = loadKnockoutFromStorage();
  const initialLoaded = loadFromStorage();
  const initial = rebuildKnockout(initialLoaded, initialStoredKnockout);
  saveKnockoutToStorage(initial.knockoutMatches);

  return {
    matches: initialLoaded,
    knockoutMatches: initial.knockoutMatches,
    bestThirdPlaces: initial.bestThirdPlaces,
    combinationIndex: initial.combinationIndex,
    comboKey: initial.comboKey,

    updateMatch: (id, homeGoals, awayGoals) => {
      set((state) => {
        const match = state.matches[id];
        if (!match) return state;
        const updatedMatches = {
          ...state.matches,
          [id]: { ...match, homeGoals, awayGoals, status: "played" as const },
        };
        saveToStorage(updatedMatches);
        const hasKnockoutMatches = Object.keys(state.knockoutMatches).length > 0;
        const rebuilt = rebuildKnockout(updatedMatches, hasKnockoutMatches ? {} : state.knockoutMatches);
        saveKnockoutToStorage(rebuilt.knockoutMatches);
        return { matches: updatedMatches, ...rebuilt };
      });
    },

    resetGroup: (group) => {
      set((state) => {
        const updatedMatches = { ...state.matches };
        Object.entries(updatedMatches).forEach(([key, m]) => {
          if (m.group === group) {
            updatedMatches[key] = { ...m, homeGoals: null, awayGoals: null, status: "pending" };
          }
        });
        saveToStorage(updatedMatches);
        const rebuilt = rebuildKnockout(updatedMatches, state.knockoutMatches);
        saveKnockoutToStorage(rebuilt.knockoutMatches);
        return { matches: updatedMatches, ...rebuilt };
      });
    },

    resetAll: () => {
      set(() => {
        saveToStorage(initialMatches);
        const rebuilt = rebuildKnockout(initialMatches, {});
        saveKnockoutToStorage(rebuilt.knockoutMatches);
        return { matches: initialMatches, ...rebuilt };
      });
    },

    resetKnockout: () => {
      set((state) => {
        const rebuilt = rebuildKnockout(state.matches, {});
        saveKnockoutToStorage(rebuilt.knockoutMatches);
        return rebuilt;
      });
    },

    randomizeGroup: (group) => {
      set((state) => {
        const updatedMatches = { ...state.matches };
        Object.entries(updatedMatches).forEach(([key, m]) => {
          if (m.group === group) {
            const { homeGoals, awayGoals } = generateMatchResult(m.homeTeam, m.awayTeam);
            updatedMatches[key] = { ...m, homeGoals, awayGoals, status: "played" as const };
          }
        });
        saveToStorage(updatedMatches);
        const rebuilt = rebuildKnockout(updatedMatches, state.knockoutMatches);
        saveKnockoutToStorage(rebuilt.knockoutMatches);
        return { matches: updatedMatches, ...rebuilt };
      });
    },

    updateKnockoutMatch: (id, homeGoals, awayGoals, homePenalties, awayPenalties) => {
      set((state) => {
        const match = state.knockoutMatches[id];
        if (!match) return state;
        const updatedMatch: KnockoutMatch = {
          ...match,
          homeGoals,
          awayGoals,
          homePenalties: homePenalties ?? null,
          awayPenalties: awayPenalties ?? null,
          status: "played" as const,
        };
        const winner = determineWinner(updatedMatch);
        const withWinner: KnockoutMatch = { ...updatedMatch, winner };

        // Splice this match in, then re-derive downstream rounds.
        const intermediate = { ...state.knockoutMatches, [id]: withWinner };
        const fullyBuilt = buildFullKnockoutBracket(state.matches, intermediate);
        saveKnockoutToStorage(fullyBuilt);
        return { knockoutMatches: fullyBuilt };
      });
    },

    initializeKnockout: () => {
      // Kept for API compatibility; no-op since the bracket is always derived.
      const state = get();
      const rebuilt = rebuildKnockout(state.matches, state.knockoutMatches);
      saveKnockoutToStorage(rebuilt.knockoutMatches);
      set(rebuilt);
    },
  };
});

export default useStore;
