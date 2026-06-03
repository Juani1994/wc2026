import type { StandingRow } from "../types";
import { TEAMS } from "../data/teams";
import { useLanguage } from "../i18n/LanguageContext";
import Flag from "./Flag";

interface StandingsTableProps {
  standings: StandingRow[];
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  const { t } = useLanguage();
  return (
    <div className="bg-slate-900 rounded-xl overflow-auto shadow-2xl border border-slate-700">
      <table className="w-full text-sm md:text-base">
        <thead>
          <tr className="bg-gradient-to-r from-blue-900 to-blue-800 border-b-2 border-blue-600">
            <th className="px-1 md:px-4 py-2 md:py-3 text-left text-xs font-bold text-blue-100 uppercase tracking-wider">
              #
            </th>
            <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-bold text-blue-100 uppercase tracking-wider">
              {t("table.team")}
            </th>
            <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">
              {t("table.p")}
            </th>
            <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">
              {t("table.w")}
            </th>
            <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">
              {t("table.d")}
            </th>
            <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">
              {t("table.l")}
            </th>
            <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">
              {t("table.gf")}
            </th>
            <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">
              {t("table.ga")}
            </th>
            <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">
              {t("table.gd")}
            </th>
            <th className="px-1 md:px-4 py-2 md:py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">
              {t("table.pts")}
            </th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, idx) => {
            const team = TEAMS[row.teamId];
            let bgColor = "bg-slate-800";
            let borderColor = "border-slate-700";

            if (idx === 0 || idx === 1) {
              bgColor = "bg-emerald-900/30";
              borderColor = "border-emerald-700";
            } else if (idx === 2) {
              bgColor = "bg-amber-900/30";
              borderColor = "border-amber-700";
            }

            return (
              <tr
                key={row.teamId}
                className={`border-b ${borderColor} hover:bg-slate-700/40 transition-colors ${bgColor}`}
              >
                <td className="px-1 md:px-4 py-2 md:py-3 text-center font-bold text-white text-xs md:text-base">
                  {idx + 1}
                </td>
                <td className="px-2 md:px-4 py-2 md:py-3 flex items-center gap-2 md:gap-3">
                  <Flag teamId={row.teamId} size="sm" />
                  <span className="text-white font-semibold truncate text-xs md:text-base">
                    {team?.name}
                  </span>
                </td>
                <td className="px-1 md:px-2 py-2 md:py-3 text-center font-semibold text-gray-200 text-xs md:text-base">
                  {row.played}
                </td>
                <td className="px-1 md:px-2 py-2 md:py-3 text-center font-semibold text-gray-200 text-xs md:text-base">
                  {row.won}
                </td>
                <td className="px-1 md:px-2 py-2 md:py-3 text-center font-semibold text-gray-200 text-xs md:text-base">
                  {row.drawn}
                </td>
                <td className="px-1 md:px-2 py-2 md:py-3 text-center font-semibold text-gray-200 text-xs md:text-base">
                  {row.lost}
                </td>
                <td className="px-1 md:px-2 py-2 md:py-3 text-center font-semibold text-gray-200 text-xs md:text-base">
                  {row.goalsFor}
                </td>
                <td className="px-1 md:px-2 py-2 md:py-3 text-center font-semibold text-gray-200 text-xs md:text-base">
                  {row.goalsAgainst}
                </td>
                <td className="px-1 md:px-2 py-2 md:py-3 text-center font-semibold text-gray-200 text-xs md:text-base">
                  {row.goalDiff > 0 ? "+" : ""}{row.goalDiff}
                </td>
                <td className="px-1 md:px-4 py-2 md:py-3 text-center font-bold text-yellow-300 text-xs md:text-base">
                  {row.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
