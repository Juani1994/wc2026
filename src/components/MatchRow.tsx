import { useState } from "react";
import type { Match } from "../types";
import { TEAMS } from "../data/teams";
import Flag from "./Flag";
import useStore from "../store/useStore";

interface MatchRowProps {
  match: Match;
}

export default function MatchRow({ match }: MatchRowProps) {
  const updateMatch = useStore((s) => s.updateMatch);
  const [homeGoals, setHomeGoals] = useState(
    match.homeGoals !== null ? String(match.homeGoals) : ""
  );
  const [awayGoals, setAwayGoals] = useState(
    match.awayGoals !== null ? String(match.awayGoals) : ""
  );

  const homeTeam = TEAMS[match.homeTeam];
  const awayTeam = TEAMS[match.awayTeam];

  const handleSave = () => {
    const h = homeGoals === "" ? null : parseInt(homeGoals);
    const a = awayGoals === "" ? null : parseInt(awayGoals);

    if (h !== null && a !== null && h >= 0 && a >= 0) {
      updateMatch(match.id, h, a);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const isPlayed = match.homeGoals !== null && match.awayGoals !== null;

  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all border ${
        isPlayed
          ? "bg-emerald-900/20 border-emerald-700/40"
          : "bg-slate-800/50 border-slate-700"
      }`}
    >
      {/* Home Team */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Flag teamId={match.homeTeam} size="md" />
        <span className="text-white font-semibold truncate text-sm">
          {homeTeam?.name}
        </span>
      </div>

      {/* Score Inputs */}
      <div className="flex items-center gap-3 shrink-0">
        <input
          type="number"
          min="0"
          max="99"
          value={homeGoals}
          onChange={(e) => setHomeGoals(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-12 h-12 text-center bg-slate-700 text-white rounded-lg font-bold text-lg border-2 border-slate-600 focus:border-blue-500 focus:outline-none hover:bg-slate-600 transition-colors"
          placeholder="—"
        />
        <span className="text-gray-400 font-bold text-lg">—</span>
        <input
          type="number"
          min="0"
          max="99"
          value={awayGoals}
          onChange={(e) => setAwayGoals(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-12 h-12 text-center bg-slate-700 text-white rounded-lg font-bold text-lg border-2 border-slate-600 focus:border-blue-500 focus:outline-none hover:bg-slate-600 transition-colors"
          placeholder="—"
        />
      </div>

      {/* Away Team */}
      <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
        <span className="text-white font-semibold truncate text-sm">
          {awayTeam?.name}
        </span>
        <Flag teamId={match.awayTeam} size="md" />
      </div>
    </div>
  );
}
