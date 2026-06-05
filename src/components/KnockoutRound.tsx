import type { KnockoutMatch } from "../types";
import { useLanguage } from "../i18n/LanguageContext";
import KnockoutMatchComponent from "./KnockoutMatch";

interface KnockoutRoundProps {
  roundName: string;
  matches: KnockoutMatch[];
  onRandomize?: () => void;
}

export default function KnockoutRound({ roundName, matches, onRandomize }: KnockoutRoundProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {roundName && (
        <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              {roundName}
            </h3>
            <span className="text-gray-400 text-sm">
              ({matches.length} {matches.length === 1 ? t("thirds.match") : t("thirds.matches")})
            </span>
          </div>
          {onRandomize && (
            <button
              onClick={onRandomize}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              🎲 {t("group.randomResults")}
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {matches.map((match) => (
          <KnockoutMatchComponent key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
