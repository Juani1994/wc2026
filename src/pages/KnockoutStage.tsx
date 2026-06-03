import { useLanguage } from "../i18n/LanguageContext";
import KnockoutRound from "../components/KnockoutRound";
import useStore from "../store/useStore";

export default function KnockoutStage() {
  const knockoutMatches = useStore((s) => s.knockoutMatches);
  const combinationIndex = useStore((s) => s.combinationIndex);
  const comboKey = useStore((s) => s.comboKey);
  const resetKnockout = useStore((s) => s.resetKnockout);
  const { t } = useLanguage();

  const r32Matches = Object.values(knockoutMatches).filter((m) => m.stage === "R32");
  const r16Matches = Object.values(knockoutMatches).filter((m) => m.stage === "R16");
  const qfMatches = Object.values(knockoutMatches).filter((m) => m.stage === "QF");
  const sfMatches = Object.values(knockoutMatches).filter((m) => m.stage === "SF");
  const finalMatch = Object.values(knockoutMatches).filter((m) => m.stage === "FINAL");
  const thirdPlaceMatch = Object.values(knockoutMatches).filter((m) => m.stage === "THIRD");

  const hasAnyR32Teams = r32Matches.some(
    (m) => m.homeTeamId !== null || m.awayTeamId !== null
  );

  const handleReset = () => {
    if (confirm(t("knockout.resetKnockout"))) {
      resetKnockout();
    }
  };

  return (
    <div className="space-y-10">
      {r32Matches.length > 0 && (
        <div className="bg-slate-800/40 rounded-lg border border-slate-700 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm text-gray-300 space-y-1">
            {combinationIndex != null && comboKey ? (
              <>
                <p>
                  <span className="text-gray-400">{t("knockout.combinationTitle")} </span>
                  <span className="font-bold text-blue-300">
                    #{combinationIndex} / 495
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">{t("knockout.groupsQualified")} </span>
                  <span className="font-mono font-bold text-emerald-300">
                    {comboKey.split("").join(" · ")}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-amber-300">
                {t("knockout.incompleteGroups")}
              </p>
            )}
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-md text-xs font-bold transition-colors shrink-0"
          >
            {t("knockout.resetKnockout")}
          </button>
        </div>
      )}

      {r32Matches.length > 0 && (
        <KnockoutRound roundName={t("knockout.round32")} matches={r32Matches} />
      )}

      {r16Matches.length > 0 && (
        <KnockoutRound roundName={t("knockout.round16")} matches={r16Matches} />
      )}

      {qfMatches.length > 0 && (
        <KnockoutRound roundName={t("knockout.quarterfinals")} matches={qfMatches} />
      )}

      {sfMatches.length > 0 && (
        <KnockoutRound roundName={t("knockout.semifinals")} matches={sfMatches} />
      )}

      {thirdPlaceMatch.length > 0 && (
        <KnockoutRound roundName={t("knockout.thirdPlace")} matches={thirdPlaceMatch} />
      )}

      {finalMatch.length > 0 && (
        <KnockoutRound roundName={t("knockout.final")} matches={finalMatch} />
      )}

      {r32Matches.length === 0 && !hasAnyR32Teams && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {t("knockout.noMatches")}
          </p>
        </div>
      )}
    </div>
  );
}
