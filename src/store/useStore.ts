import { create } from "zustand";
import type { Match } from "../types";
import { generateAllMatches } from "../data/groups";

const STORAGE_KEY = "wc2026_state";

interface State {
  matches: Record<string, Match>;
  updateMatch: (id: string, homeGoals: number, awayGoals: number) => void;
  resetGroup: (group: string) => void;
  resetAll: () => void;
}

const initialMatches = generateAllMatches();

const useStore = create<State>((set) => {
  // Load from localStorage on initialization
  const loadFromStorage = (): Record<string, Match> => {
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
  };
});

export default useStore;
