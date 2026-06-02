import { GROUP_IDS } from "../data/groups";
import type { GroupId } from "../data/groups";

type ViewMode = GroupId | "THIRDS" | "KNOCKOUT";

interface GroupNavProps {
  activeView: ViewMode;
  onSelectView: (view: ViewMode) => void;
}

export default function GroupNav({ activeView, onSelectView }: GroupNavProps) {
  return (
    <div className="bg-slate-800/50 rounded-lg p-2 flex gap-1.5 overflow-x-auto scrollbar-hide border border-slate-700">
      {GROUP_IDS.map((group) => (
        <button
          key={group}
          onClick={() => onSelectView(group)}
          className={`w-10 h-10 rounded-lg font-bold transition-all text-sm flex items-center justify-center shrink-0 ${
            activeView === group
              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50"
              : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
          }`}
        >
          {group}
        </button>
      ))}
      <button
        onClick={() => onSelectView("THIRDS")}
        className={`px-3 h-10 rounded-lg font-bold transition-all text-sm flex items-center justify-center shrink-0 ${
          activeView === "THIRDS"
            ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/50"
            : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
        }`}
      >
        🏅 Terceros
      </button>
      <button
        onClick={() => onSelectView("KNOCKOUT")}
        className={`px-3 h-10 rounded-lg font-bold transition-all text-sm flex items-center justify-center shrink-0 ${
          activeView === "KNOCKOUT"
            ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/50"
            : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
        }`}
      >
        🏆 Bracket
      </button>
    </div>
  );
}
