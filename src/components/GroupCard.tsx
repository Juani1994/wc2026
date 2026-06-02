import type { GroupId } from "../data/groups";
import { calculateStandings } from "../utils/standings";
import StandingsTable from "./StandingsTable";
import MatchRow from "./MatchRow";
import useStore from "../store/useStore";

interface GroupCardProps {
  groupId: GroupId;
}

export default function GroupCard({ groupId }: GroupCardProps) {
  const allMatches = useStore((s) => s.matches);
  const resetGroup = useStore((s) => s.resetGroup);
  const randomizeGroup = useStore((s) => s.randomizeGroup);

  const standings = calculateStandings(groupId, allMatches);
  const groupMatches = Object.values(allMatches).filter(
    (m) => m.group === groupId
  );

  const matchesByMatchday = {
    1: groupMatches.filter((m) => m.matchday === 1),
    2: groupMatches.filter((m) => m.matchday === 2),
    3: groupMatches.filter((m) => m.matchday === 3),
  };

  const handleResetGroup = () => {
    if (confirm(`Reset all results for Group ${groupId}?`)) {
      resetGroup(groupId);
    }
  };

  const handleRandomize = () => {
    randomizeGroup(groupId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
          Group {groupId}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleRandomize}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg"
          >
            🎲 Random Results
          </button>
          <button
            onClick={handleResetGroup}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-lg"
          >
            Reset Group
          </button>
        </div>
      </div>

      {/* Standings and Matches Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Standings Table */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
            <span className="text-blue-400">📊</span> Standings
          </h3>
          <StandingsTable standings={standings} />
        </div>

        {/* Matches */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="text-blue-400">⚽</span> Fixtures
          </h3>

          {[1, 2, 3].map((md) => (
            <div key={md} className="bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
              <div className="px-4 py-2 bg-slate-800 border-b border-slate-700">
                <span className="font-bold text-white text-sm">
                  📅 Matchday {md}
                </span>
              </div>
              <div className="px-3 py-3 space-y-2">
                {matchesByMatchday[md as 1 | 2 | 3].map((match) => (
                  <MatchRow key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
