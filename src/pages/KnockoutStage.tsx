import { useEffect } from "react";
import KnockoutRound from "../components/KnockoutRound";
import useStore from "../store/useStore";

export default function KnockoutStage() {
  const knockoutMatches = useStore((s) => s.knockoutMatches);
  const initializeKnockout = useStore((s) => s.initializeKnockout);

  // Initialize knockout on mount if not already done
  useEffect(() => {
    if (Object.keys(knockoutMatches).length === 0) {
      initializeKnockout();
    }
  }, [knockoutMatches, initializeKnockout]);

  const r32Matches = Object.values(knockoutMatches).filter((m) => m.stage === "R32");
  const r16Matches = Object.values(knockoutMatches).filter((m) => m.stage === "R16");
  const qfMatches = Object.values(knockoutMatches).filter((m) => m.stage === "QF");
  const sfMatches = Object.values(knockoutMatches).filter((m) => m.stage === "SF");
  const finalMatch = Object.values(knockoutMatches).filter((m) => m.stage === "FINAL");
  const thirdPlaceMatch = Object.values(knockoutMatches).filter((m) => m.stage === "THIRD");

  return (
    <div className="space-y-12">
      {/* Round of 32 */}
      {r32Matches.length > 0 && (
        <KnockoutRound roundName="🏁 Round of 32" matches={r32Matches} />
      )}

      {/* Round of 16 */}
      {r16Matches.length > 0 && (
        <KnockoutRound roundName="⚽ Round of 16" matches={r16Matches} />
      )}

      {/* Quarterfinals */}
      {qfMatches.length > 0 && (
        <KnockoutRound roundName="🎯 Cuartos de Final" matches={qfMatches} />
      )}

      {/* Semifinals */}
      {sfMatches.length > 0 && (
        <KnockoutRound roundName="🔥 Semifinales" matches={sfMatches} />
      )}

      {/* Third Place Match */}
      {thirdPlaceMatch.length > 0 && (
        <KnockoutRound roundName="🥉 Tercer Puesto" matches={thirdPlaceMatch} />
      )}

      {/* Final */}
      {finalMatch.length > 0 && (
        <KnockoutRound roundName="🏆 Final" matches={finalMatch} />
      )}

      {r32Matches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            Completa los grupos para ver el bracket de knockout
          </p>
        </div>
      )}
    </div>
  );
}
