import { useState, useEffect } from "react";
import type { KnockoutMatch } from "../types";
import { TEAMS } from "../data/teams";
import { useLanguage } from "../i18n/LanguageContext";
import Flag from "./Flag";
import useStore from "../store/useStore";

interface KnockoutMatchProps {
  match: KnockoutMatch;
}

export default function KnockoutMatchComponent({ match }: KnockoutMatchProps) {
  const updateKnockoutMatch = useStore((s) => s.updateKnockoutMatch);
  const { t } = useLanguage();
  const [homeGoals, setHomeGoals] = useState(
    match.homeGoals !== null ? String(match.homeGoals) : ""
  );
  const [awayGoals, setAwayGoals] = useState(
    match.awayGoals !== null ? String(match.awayGoals) : ""
  );

  useEffect(() => {
    setHomeGoals(match.homeGoals !== null ? String(match.homeGoals) : "");
    setAwayGoals(match.awayGoals !== null ? String(match.awayGoals) : "");
  }, [match.homeGoals, match.awayGoals]);

  const homeTeam = match.homeTeamId ? TEAMS[match.homeTeamId] : null;
  const awayTeam = match.awayTeamId ? TEAMS[match.awayTeamId] : null;

  const handleSave = () => {
    const h = homeGoals === "" ? null : parseInt(homeGoals);
    const a = awayGoals === "" ? null : parseInt(awayGoals);

    if (h !== null && a !== null && h >= 0 && a >= 0) {
      updateKnockoutMatch(match.id, h, a);
    }
  };

  const handleChooseWinner = (winnerTeamId: string) => {
    if (match.homeGoals !== null && match.awayGoals !== null) {
      updateKnockoutMatch(match.id, match.homeGoals, match.awayGoals, undefined, undefined, winnerTeamId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const isPlayed = match.homeGoals !== null && match.awayGoals !== null;
  const isDraw = isPlayed && match.homeGoals === match.awayGoals;

  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-lg border transition-all ${
        isPlayed
          ? "bg-emerald-900/20 border-emerald-700/40"
          : "bg-slate-800/50 border-slate-700"
      }`}
    >
      {/* Match Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 uppercase">
          {match.stage} - Match {match.matchNumber}
        </span>
        {match.winner && (
          <span className="text-xs font-bold text-emerald-400">
            ✓ {t("match.winner")} {TEAMS[match.winner]?.name}
          </span>
        )}
      </div>

      {/* Home Team */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {homeTeam && <Flag teamId={match.homeTeamId!} size="sm" />}
          <span className="text-white font-semibold truncate text-sm">
            {homeTeam?.name || t("match.tbd")}
          </span>
        </div>
        <input
          type="number"
          min="0"
          max="99"
          value={homeGoals}
          onChange={(e) => setHomeGoals(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-12 h-10 text-center bg-slate-700 text-white rounded-lg font-bold text-lg border-2 border-slate-600 focus:border-blue-500 focus:outline-none"
          placeholder="—"
        />
      </div>

      {/* Away Team */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {awayTeam && <Flag teamId={match.awayTeamId!} size="sm" />}
          <span className="text-white font-semibold truncate text-sm">
            {awayTeam?.name || t("match.tbd")}
          </span>
        </div>
        <input
          type="number"
          min="0"
          max="99"
          value={awayGoals}
          onChange={(e) => setAwayGoals(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-12 h-10 text-center bg-slate-700 text-white rounded-lg font-bold text-lg border-2 border-slate-600 focus:border-blue-500 focus:outline-none"
          placeholder="—"
        />
      </div>

      {/* Penalties (if draw) */}
      {isDraw && (
        <div className="mt-2 pt-3 border-t border-slate-600 space-y-2">
          <span className="text-xs text-gray-400 mb-2 block">{t("match.penalties")}</span>
          <div className="flex gap-2">
            <button
              onClick={() => match.homeTeamId && handleChooseWinner(match.homeTeamId)}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${
                match.winner === match.homeTeamId
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
            >
              {homeTeam?.name || t("match.tbd")}
            </button>
            <button
              onClick={() => match.awayTeamId && handleChooseWinner(match.awayTeamId)}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${
                match.winner === match.awayTeamId
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
            >
              {awayTeam?.name || t("match.tbd")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
