import { create } from "zustand";
import type { Match } from "../types";
import { generateAllMatches } from "../data/groups";
import { generateMatchResult } from "../utils/randomMatch";
import { decodeStateFromUrl } from "../utils/shareState";

const STORAGE_KEY = "wc2026_state";

interface State {
  matches: Record<string, Match>;
  updateMatch: (id: string, homeGoals: number, awayGoals: number) => void;
  resetGroup: (group: string) => void;
  resetAll: () => void;
  randomizeGroup: (group: string) => void;
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

  return {
    matches: loadFromStorage(),

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
  };
});

export default useStore;
