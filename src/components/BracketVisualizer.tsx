import { useLanguage } from "../i18n/LanguageContext";
import type { KnockoutMatch } from "../types";
import { TEAMS } from "../data/teams";
import Flag from "./Flag";

interface BracketVisualizerProps {
  knockoutMatches: Record<string, KnockoutMatch>;
}

// Strip leading emoji from translated labels (translations include decorative
// emojis like "🏁 Round of 32" which clutter the bracket header).
const stripEmoji = (s: string) =>
  s.replace(/^[^\p{L}\p{N}]+/u, "").trim();

export default function BracketVisualizer({ knockoutMatches }: BracketVisualizerProps) {
  const { t } = useLanguage();

  // ---- Layout constants --------------------------------------------------
  const BOX_WIDTH = 158;
  const BOX_HEIGHT = 54;
  const COL_GAP = 38;
  const TOP_MARGIN = 78;
  const VERT_GAP = 16;

  // R32 vertical positions: 8 matches per side, evenly spaced.
  const r32Y: number[] = Array.from({ length: 8 }, (_, i) =>
    TOP_MARGIN + BOX_HEIGHT / 2 + i * (BOX_HEIGHT + VERT_GAP)
  );
  // R16 centered between pairs of R32.
  const r16Y: number[] = [0, 1, 2, 3].map((i) =>
    (r32Y[i * 2] + r32Y[i * 2 + 1]) / 2
  );
  // QF centered between pairs of R16.
  const qfY: number[] = [0, 1].map((i) =>
    (r16Y[i * 2] + r16Y[i * 2 + 1]) / 2
  );
  // SF: single match per side, centered between QF pair.
  const sfY = (qfY[0] + qfY[1]) / 2;

  // X positions for the 9 columns (left R32 → Final → right R32).
  const stride = BOX_WIDTH + COL_GAP;
  const X = {
    lR32: 20,
    lR16: 20 + 1 * stride,
    lQF: 20 + 2 * stride,
    lSF: 20 + 3 * stride,
    fin: 20 + 4 * stride,
    rSF: 20 + 5 * stride,
    rQF: 20 + 6 * stride,
    rR16: 20 + 7 * stride,
    rR32: 20 + 8 * stride,
  };

  const TOTAL_WIDTH = X.rR32 + BOX_WIDTH + 20;
  const finalY = sfY;
  const thirdY = sfY + 188;
  const TOTAL_HEIGHT = Math.max(r32Y[7] + BOX_HEIGHT / 2 + 30, thirdY + BOX_HEIGHT / 2 + 30);

  // ---- Match retrieval ---------------------------------------------------
  const byStage = (stage: string) =>
    Object.values(knockoutMatches)
      .filter((m) => m.stage === stage)
      .sort((a, b) => a.matchNumber - b.matchNumber);

  const r32 = byStage("R32");
  const r16 = byStage("R16");
  const qf = byStage("QF");
  const sf = byStage("SF");
  const finalMatch = byStage("FINAL")[0];
  const thirdMatch = byStage("THIRD")[0];

  const r32L = r32.slice(0, 8);
  const r32R = r32.slice(8, 16);
  const r16L = r16.slice(0, 4);
  const r16R = r16.slice(4, 8);
  const qfL = qf.slice(0, 2);
  const qfR = qf.slice(2, 4);
  const sfL = sf[0];
  const sfR = sf[1];

  // ---- Helpers -----------------------------------------------------------
  const wonByPenalties = (m: KnockoutMatch | undefined) =>
    !!m &&
    m.homeGoals !== null &&
    m.awayGoals !== null &&
    m.homeGoals === m.awayGoals &&
    m.homePenalties !== null &&
    m.awayPenalties !== null;

  // ---- Subcomponents -----------------------------------------------------
  const TeamRow = ({
    teamId,
    score,
    isWinner,
    showPensAsterisk,
    isPlayed,
  }: {
    teamId: string | null;
    score: number | null;
    isWinner: boolean;
    showPensAsterisk: boolean;
    isPlayed: boolean;
  }) => {
    const team = teamId ? TEAMS[teamId] : null;
    const winnerStyle = isPlayed && isWinner;
    const loserStyle = isPlayed && !isWinner;
    const asterisk = isWinner && showPensAsterisk ? "*" : "";

    return (
      <div
        className={`flex items-center justify-between gap-1.5 px-1.5 ${
          winnerStyle ? "bg-emerald-900/30" : ""
        }`}
        style={{ height: BOX_HEIGHT / 2 }}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {teamId ? (
            <Flag teamId={teamId} size="sm" />
          ) : (
            <span className="w-6 h-5 bg-slate-700 rounded-sm inline-block" />
          )}
          <span
            className={`text-[11px] leading-tight truncate ${
              winnerStyle
                ? "text-white font-semibold"
                : loserStyle
                ? "text-gray-500"
                : "text-gray-300"
            }`}
          >
            {team ? `${team.name}${asterisk}` : "TBD"}
          </span>
        </div>
        <span
          className={`text-xs font-bold tabular-nums shrink-0 ${
            winnerStyle ? "text-emerald-400" : "text-gray-500"
          }`}
        >
          {score ?? "-"}
        </span>
      </div>
    );
  };

  const MatchBox = ({
    match,
    x,
    yCenter,
    variant = "default",
  }: {
    match: KnockoutMatch | undefined;
    x: number;
    yCenter: number;
    variant?: "default" | "final" | "third";
  }) => {
    if (!match) return null;
    const isPlayed = match.homeGoals !== null && match.awayGoals !== null;
    const pens = wonByPenalties(match);
    const homeWin = match.winner === match.homeTeamId;
    const awayWin = match.winner === match.awayTeamId;

    const borderClass =
      variant === "final"
        ? "border-yellow-500/70 ring-2 ring-yellow-500/30 shadow-lg shadow-yellow-500/20"
        : variant === "third"
        ? "border-purple-500/50"
        : isPlayed
        ? "border-emerald-700/50"
        : "border-slate-600";

    return (
      <div
        className={`absolute bg-slate-900/95 border ${borderClass} rounded-md overflow-hidden`}
        style={{
          left: x,
          top: yCenter - BOX_HEIGHT / 2,
          width: BOX_WIDTH,
          height: BOX_HEIGHT,
        }}
      >
        <TeamRow
          teamId={match.homeTeamId}
          score={match.homeGoals}
          isWinner={homeWin}
          showPensAsterisk={pens}
          isPlayed={isPlayed}
        />
        <div className="border-t border-slate-700/60" />
        <TeamRow
          teamId={match.awayTeamId}
          score={match.awayGoals}
          isWinner={awayWin}
          showPensAsterisk={pens}
          isPlayed={isPlayed}
        />
      </div>
    );
  };

  const Label = ({
    text,
    x,
    y,
    color = "text-gray-400",
    size = "text-[11px]",
  }: {
    text: string;
    x: number;
    y: number;
    color?: string;
    size?: string;
  }) => (
    <div
      className={`absolute font-bold uppercase tracking-wider ${color} ${size}`}
      style={{ left: x, top: y, width: BOX_WIDTH, textAlign: "center" }}
    >
      {text}
    </div>
  );

  // ---- Connector path generation ----------------------------------------
  // Builds an "H" connector: two horizontal stubs from a pair of matches meet
  // a vertical line in the gutter, and a horizontal stub leaves the gutter
  // midpoint toward the next-round match.
  const connector = (
    sourceX: number, // x where line leaves source match
    upperY: number,
    lowerY: number,
    targetX: number, // x where line enters next-round match
    midY: number
  ): string => {
    const gutter = (sourceX + targetX) / 2;
    return [
      `M${sourceX} ${upperY} H${gutter} V${lowerY} H${sourceX}`,
      `M${gutter} ${midY} H${targetX}`,
    ].join(" ");
  };

  const buildConnectors = (side: "L" | "R") => {
    const paths: string[] = [];
    const r32X = side === "L" ? X.lR32 : X.rR32;
    const r16X = side === "L" ? X.lR16 : X.rR16;
    const qfX = side === "L" ? X.lQF : X.rQF;
    const sfX = side === "L" ? X.lSF : X.rSF;

    // Source side is the inner edge of each box (closer to center).
    const innerEdge = (col: number) =>
      side === "L" ? col + BOX_WIDTH : col;
    const outerOfTarget = (col: number) =>
      side === "L" ? col : col + BOX_WIDTH;

    // R32 → R16
    for (let i = 0; i < 4; i++) {
      paths.push(
        connector(
          innerEdge(r32X),
          r32Y[i * 2],
          r32Y[i * 2 + 1],
          outerOfTarget(r16X),
          r16Y[i]
        )
      );
    }
    // R16 → QF
    for (let i = 0; i < 2; i++) {
      paths.push(
        connector(
          innerEdge(r16X),
          r16Y[i * 2],
          r16Y[i * 2 + 1],
          outerOfTarget(qfX),
          qfY[i]
        )
      );
    }
    // QF → SF
    paths.push(
      connector(
        innerEdge(qfX),
        qfY[0],
        qfY[1],
        outerOfTarget(sfX),
        sfY
      )
    );
    // SF → Final (straight horizontal line, no merge)
    const sfInner = innerEdge(sfX);
    const finOuter = side === "L" ? X.fin : X.fin + BOX_WIDTH;
    paths.push(`M${sfInner} ${sfY} H${finOuter}`);

    return paths;
  };

  const leftPaths = buildConnectors("L");
  const rightPaths = buildConnectors("R");

  // ---- Render ------------------------------------------------------------
  return (
    <div className="w-full overflow-x-auto bg-gradient-to-b from-slate-950 to-slate-900 rounded-lg p-2 sm:p-4">
      <div
        className="relative mx-auto"
        style={{ width: TOTAL_WIDTH, height: TOTAL_HEIGHT, minWidth: TOTAL_WIDTH }}
      >
        {/* SVG layer for connector lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={TOTAL_WIDTH}
          height={TOTAL_HEIGHT}
          viewBox={`0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}`}
        >
          <g stroke="#475569" strokeWidth="1.5" fill="none">
            {leftPaths.map((d, i) => (
              <path key={`lp-${i}`} d={d} />
            ))}
            {rightPaths.map((d, i) => (
              <path key={`rp-${i}`} d={d} />
            ))}
          </g>
        </svg>

        {/* Top round labels */}
        <Label text={stripEmoji(t("knockout.round32"))} x={X.lR32} y={42} />
        <Label text={stripEmoji(t("knockout.round16"))} x={X.lR16} y={42} />
        <Label text={stripEmoji(t("knockout.quarterfinals"))} x={X.lQF} y={42} />
        <Label text={stripEmoji(t("knockout.semifinals"))} x={X.lSF} y={42} />
        <Label
          text={stripEmoji(t("knockout.final"))}
          x={X.fin}
          y={32}
          color="text-yellow-400"
          size="text-sm"
        />
        <Label text={stripEmoji(t("knockout.semifinals"))} x={X.rSF} y={42} />
        <Label text={stripEmoji(t("knockout.quarterfinals"))} x={X.rQF} y={42} />
        <Label text={stripEmoji(t("knockout.round16"))} x={X.rR16} y={42} />
        <Label text={stripEmoji(t("knockout.round32"))} x={X.rR32} y={42} />

        {/* 3rd place label */}
        {thirdMatch && (
          <Label
            text={stripEmoji(t("knockout.thirdPlace"))}
            x={X.fin}
            y={thirdY - BOX_HEIGHT / 2 - 22}
            color="text-purple-400"
          />
        )}

        {/* Match boxes — left side */}
        {r32L.map((m, i) => (
          <MatchBox key={m.id} match={m} x={X.lR32} yCenter={r32Y[i]} />
        ))}
        {r16L.map((m, i) => (
          <MatchBox key={m.id} match={m} x={X.lR16} yCenter={r16Y[i]} />
        ))}
        {qfL.map((m, i) => (
          <MatchBox key={m.id} match={m} x={X.lQF} yCenter={qfY[i]} />
        ))}
        <MatchBox match={sfL} x={X.lSF} yCenter={sfY} />

        {/* Center: Final + 3rd place */}
        <MatchBox match={finalMatch} x={X.fin} yCenter={finalY} variant="final" />
        <MatchBox match={thirdMatch} x={X.fin} yCenter={thirdY} variant="third" />

        {/* Match boxes — right side */}
        <MatchBox match={sfR} x={X.rSF} yCenter={sfY} />
        {qfR.map((m, i) => (
          <MatchBox key={m.id} match={m} x={X.rQF} yCenter={qfY[i]} />
        ))}
        {r16R.map((m, i) => (
          <MatchBox key={m.id} match={m} x={X.rR16} yCenter={r16Y[i]} />
        ))}
        {r32R.map((m, i) => (
          <MatchBox key={m.id} match={m} x={X.rR32} yCenter={r32Y[i]} />
        ))}
      </div>
    </div>
  );
}
