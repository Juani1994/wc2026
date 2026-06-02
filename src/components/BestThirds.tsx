import { getThirdPlaces } from "../utils/thirds";
import { TEAMS } from "../data/teams";
import Flag from "./Flag";
import useStore from "../store/useStore";

export default function BestThirds() {
  const matches = useStore((s) => s.matches);
  const combinationIndex = useStore((s) => s.combinationIndex);
  const thirds = getThirdPlaces(matches);

  return (
    <div className="space-y-4">
      {combinationIndex > 0 && (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
          <p className="text-sm text-gray-300">
            <span className="text-gray-400">Combinación de 495: </span>
            <span className="font-bold text-blue-300">#{combinationIndex}</span>
          </p>
        </div>
      )}

      <div className="bg-slate-900 rounded-xl overflow-auto shadow-2xl border border-slate-700">
        <table className="w-full text-sm md:text-base">
          <thead>
            <tr className="bg-slate-800 border-b border-slate-700">
              <th className="px-1 md:px-4 py-2 md:py-3 text-left text-xs font-bold text-blue-100 uppercase tracking-wider">
                #
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs font-bold text-blue-100 uppercase tracking-wider">
                Team
              </th>
              <th className="px-1 md:px-4 py-2 md:py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">
                Grp
              </th>
              <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">
                P
              </th>
              <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">
                GF
              </th>
              <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">
                GA
              </th>
              <th className="px-1 md:px-2 py-2 md:py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">
                GD
              </th>
              <th className="px-1 md:px-4 py-2 md:py-3 text-center text-xs font-bold text-blue-100 uppercase tracking-wider">
                Pts
              </th>
            </tr>
          </thead>
          <tbody>
            {thirds.map((row, idx) => {
              const team = TEAMS[row.teamId];
              const qualifies = idx < 8;
              const bgColor = qualifies ? "bg-emerald-900/30 border-emerald-700" : "bg-slate-800 border-slate-700";

              return (
                <tr key={row.teamId} className={`border-b ${bgColor} hover:bg-slate-700/40 transition-colors`}>
                  <td className={`px-1 md:px-4 py-2 md:py-3 text-center font-bold text-xs md:text-base ${qualifies ? "text-emerald-300" : "text-white"}`}>
                    {idx + 1}
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 flex items-center gap-2 md:gap-3">
                    <Flag teamId={row.teamId} size="sm" />
                    <span className="text-white font-semibold truncate text-xs md:text-base">{team?.name}</span>
                  </td>
                  <td className="px-1 md:px-4 py-2 md:py-3 text-center font-bold text-gray-200 text-xs md:text-base">{row.groupId}</td>
                  <td className="px-1 md:px-2 py-2 md:py-3 text-center font-semibold text-gray-200 text-xs md:text-base">{row.played}</td>
                  <td className="px-1 md:px-2 py-2 md:py-3 text-center font-semibold text-gray-200 text-xs md:text-base">{row.goalsFor}</td>
                  <td className="px-1 md:px-2 py-2 md:py-3 text-center font-semibold text-gray-200 text-xs md:text-base">{row.goalsAgainst}</td>
                  <td className="px-1 md:px-2 py-2 md:py-3 text-center font-semibold text-gray-200 text-xs md:text-base">
                    {row.goalDiff > 0 ? "+" : ""}{row.goalDiff}
                  </td>
                  <td className="px-1 md:px-4 py-2 md:py-3 text-center font-bold text-yellow-300 text-xs md:text-base">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
