import { TEAMS } from "../data/teams";

export function generateMatchResult(
  homeTeamId: string,
  awayTeamId: string
): { homeGoals: number; awayGoals: number } {

  const home = TEAMS[homeTeamId];
  const away = TEAMS[awayTeamId];

  /*
    FIFA coefficient rating.

    Higher value = stronger team.

    Example:

    Argentina 1886
    France 1859
    England 1813
  */

  const diff =
    home.fifaRanking -
    away.fifaRanking;

  /*
    Logistic probability curve.

    Examples roughly:

    diff 0     → 50%
    diff +50   → 60%
    diff +100  → 70%
    diff +200  → 84%
  */

  const baseHomeWin =
    1 /
    (
      1 +
      Math.exp(
        -diff / 120
      )
    );

  /*
    Draw model.

    Balanced teams draw more.
    Large strength gaps draw less.
  */

  const drawProbability =
    Math.max(
      0.18,
      0.28 -
      Math.abs(diff) / 800
    );

  const homeWinProbability =
    baseHomeWin *
    (1 - drawProbability);

  const awayWinProbability =
    (1 - baseHomeWin) *
    (1 - drawProbability);

  const random =
    Math.random();

  let outcome:
    "HOME" |
    "DRAW" |
    "AWAY";

  if (
    random <
    homeWinProbability
  ) {

    outcome = "HOME";

  } else if (

    random <
    homeWinProbability +
    drawProbability

  ) {

    outcome = "DRAW";

  } else {

    outcome = "AWAY";
  }

  /*
    Poisson helper
  */

  function poisson(
    lambda: number
  ): number {

    const L =
      Math.exp(-lambda);

    let k = 0;
    let p = 1;

    do {

      k++;

      p *=
        Math.random();

    } while (p > L);

    return k - 1;
  }

  /*
    Goal expectation.

    Tuned for realistic
    international football scoring.
  */

  const homeLambda =
    Math.max(
      0.45,
      1.15 +
      diff / 650
    );

  const awayLambda =
    Math.max(
      0.35,
      1.15 -
      diff / 650
    );

  let homeGoals: number;
  let awayGoals: number;

  switch (outcome) {

    case "HOME":

      awayGoals =
        poisson(
          awayLambda * 0.75
        );

      homeGoals =
        Math.max(
          awayGoals + 1,
          poisson(
            homeLambda * 1.02
          )
        );

      break;

    case "AWAY":

      homeGoals =
        poisson(
          homeLambda * 0.75
        );

      awayGoals =
        Math.max(
          homeGoals + 1,
          poisson(
            awayLambda * 1.02
          )
        );

      break;

    case "DRAW":

      /*
        Realistic draw distribution.
      */

      const drawRand =
        Math.random();

      if (
        drawRand < 0.18
      ) {

        homeGoals = 0;
        awayGoals = 0;

      } else if (

        drawRand < 0.78

      ) {

        homeGoals = 1;
        awayGoals = 1;

      } else if (

        drawRand < 0.97

      ) {

        homeGoals = 2;
        awayGoals = 2;

      } else {

        homeGoals = 3;
        awayGoals = 3;
      }

      break;
  }

  return {
    homeGoals,
    awayGoals
  };
}