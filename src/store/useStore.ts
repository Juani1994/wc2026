import { create } from "zustand";
import type { Match, KnockoutMatch } from "../types";
import { generateAllMatches } from "../data/groups";
import { generateMatchResult } from "../utils/randomMatch";
import { decodeStateFromUrl } from "../utils/shareState";
import {
  getBestThirdPlaces,
  initializeRound32Matches,
  determineWinner,
  progressKnockout,
} from "../utils/knockoutLogic";
import { getCombinationIndex } from "../data/round32Combinations";

const STORAGE_KEY = "wc2026_state";
const KNOCKOUT_STORAGE_KEY = "wc2026_knockout";

interface State {
  matches: Record<string, Match>;
  knockoutMatches: Record<string, KnockoutMatch>;
  bestThirdPlaces: any[];
  combinationIndex: number;
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
  randomizeGroup: (group: string) => void;
  initializeKnockout: () => void;
}

const initialMatches = generateAllMatches();

const useStore = create<State>((set) => {
  // Load from URL or localStorage on initialization
  const loadFromStorage = (): Record<string, Match> => {
    // Try to load from URL first
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const encodedState = params.get("predictions");
      if (encodedState) {
        const decoded = decodeStateFromUrl(encodedState);
        if (decoded && Object.keys(decoded).length > 0) {
          // Merge decoded scores with initial matches structure
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

    // Fall back to localStorage
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

  return {
    matches: loadFromStorage(),
    knockoutMatches: loadKnockoutFromStorage(),
    bestThirdPlaces: [],
    combinationIndex: 0,

    updateMatch: (id: string, homeGoals: number, awayGoals: number) => {
      set((state) => {
        const match = state.matches[id];
        if (!match) return state;

        const updatedMatches = {
          ...state.matches,
          [id]: {
            ...match,
            homeGoals,
            awayGoals,
            status: "played" as const,
          },
        };

        saveToStorage(updatedMatches);
        return { matches: updatedMatches };
      });
    },

    resetGroup: (group: string) => {
      set((state) => {
        const updatedMatches = { ...state.matches };
        Object.entries(updatedMatches).forEach(([key, match]) => {
          if (match.group === group) {
            updatedMatches[key] = {
              ...match,
              homeGoals: null,
              awayGoals: null,
              status: "pending",
            };
          }
        });

        saveToStorage(updatedMatches);
        return { matches: updatedMatches };
      });
    },

    resetAll: () => {
      set(() => {
        saveToStorage(initialMatches);
        return { matches: initialMatches };
      });
    },

    randomizeGroup: (group: string) => {
      set((state) => {
        const updatedMatches = { ...state.matches };
        Object.entries(updatedMatches).forEach(([key, match]) => {
          if (match.group === group) {
            const { homeGoals, awayGoals } = generateMatchResult(
              match.homeTeam,
              match.awayTeam
            );
            updatedMatches[key] = {
              ...match,
              homeGoals,
              awayGoals,
              status: "played" as const,
            };
          }
        });

        saveToStorage(updatedMatches);
        return { matches: updatedMatches };
      });
    },

    updateKnockoutMatch: (
      id: string,
      homeGoals: number,
      awayGoals: number,
      homePenalties?: number,
      awayPenalties?: number
    ) => {
      set((state) => {
        const match = state.knockoutMatches[id];
        if (!match) return state;

        const winner = determineWinner({
          ...match,
          homeGoals,
          awayGoals,
          homePenalties: homePenalties || match.homePenalties,
          awayPenalties: awayPenalties || match.awayPenalties,
        });

        let updatedKnockout = {
          ...state.knockoutMatches,
          [id]: {
            ...match,
            homeGoals,
            awayGoals,
            homePenalties,
            awayPenalties,
            winner,
            status: "played" as const,
          },
        };

        // Check if we need to progress to next round
        updatedKnockout = progressKnockout(updatedKnockout);

        localStorage.setItem(KNOCKOUT_STORAGE_KEY, JSON.stringify(updatedKnockout));
        return { knockoutMatches: updatedKnockout };
      });
    },

    initializeKnockout: () => {
      set((state) => {
        const thirdPlaces = getBestThirdPlaces(state.matches);
        const thirdGroups = thirdPlaces.map((t) => t.group);
        const combinationIndex = getCombinationIndex(thirdGroups);
        const knockoutMatches = initializeRound32Matches(
          state.matches,
          thirdPlaces
        );

        localStorage.setItem(KNOCKOUT_STORAGE_KEY, JSON.stringify(knockoutMatches));
        return {
          knockoutMatches,
          bestThirdPlaces: thirdPlaces,
          combinationIndex
        };
      });
    },
  };
});

export default useStore;
