import { useLanguage } from "../i18n/LanguageContext";
import KnockoutRound from "../components/KnockoutRound";
import useStore from "../store/useStore";

export default function KnockoutStage() {
  const knockoutMatches = useStore((s) => s.knockoutMatches);
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
        <>
          {hasAnyR32Teams && (
            <div className="flex items-center justify-between gap-3 border-b border-slate-700 pb-3">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  {t("knockout.round32")}
                </h3>
                <span className="text-gray-400 text-sm">
                  ({r32Matches.length} {r32Matches.length === 1 ? t("thirds.match") : t("thirds.matches")})
                </span>
              </div>
              <button
                onClick={handleReset}
                className="px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-md text-xs font-bold transition-colors"
              >
                {t("knockout.resetKnockout")}
              </button>
            </div>
          )}
          <KnockoutRound roundName={hasAnyR32Teams ? "" : t("knockout.round32")} matches={r32Matches} />
        </>
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
