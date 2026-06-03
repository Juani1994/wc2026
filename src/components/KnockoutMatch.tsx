import { useState } from "react";
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
  const [homePenalties, setHomePenalties] = useState(
    match.homePenalties !== null ? String(match.homePenalties) : ""
  );
  const [awayPenalties, setAwayPenalties] = useState(
    match.awayPenalties !== null ? String(match.awayPenalties) : ""
  );

  const homeTeam = match.homeTeamId ? TEAMS[match.homeTeamId] : null;
  const awayTeam = match.awayTeamId ? TEAMS[match.awayTeamId] : null;

  const handleSave = () => {
    const h = homeGoals === "" ? null : parseInt(homeGoals);
    const a = awayGoals === "" ? null : parseInt(awayGoals);

    if (h !== null && a !== null && h >= 0 && a >= 0) {
      const hp = homePenalties === "" ? undefined : parseInt(homePenalties);
      const ap = awayPenalties === "" ? undefined : parseInt(awayPenalties);
      updateKnockoutMatch(match.id, h, a, hp, ap);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  const isPlayed = match.homeGoals !== null && match.awayGoals !== null;
  const isDraw =
    isPlayed && match.homeGoals === match.awayGoals;

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
          <span className="text-xs text-gray-400">{t("match.penalties")}</span>
          <div className="flex gap-2 items-center justify-center">
            <input
              type="number"
              min="0"
              max="15"
              value={homePenalties}
              onChange={(e) => setHomePenalties(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              placeholder="—"
              className="w-12 h-10 text-center bg-slate-700 text-white rounded-lg font-bold border-2 border-yellow-600 focus:border-yellow-400"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              min="0"
              max="15"
              value={awayPenalties}
              onChange={(e) => setAwayPenalties(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              placeholder="—"
              className="w-12 h-10 text-center bg-slate-700 text-white rounded-lg font-bold border-2 border-yellow-600 focus:border-yellow-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}
