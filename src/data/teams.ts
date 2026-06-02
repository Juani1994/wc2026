import type { Team } from "../types";

// FIFA World Rankings Points (April 1, 2026)
export const TEAMS: Record<string, Team> = {
  // Group A
  MEX: { id: "MEX", name: "Mexico", group: "A", seed: 1, fifaRanking: 1681 },
  ZAF: { id: "ZAF", name: "South Africa", group: "A", seed: 2, fifaRanking: 1420 },
  KOR: { id: "KOR", name: "South Korea", group: "A", seed: 3, fifaRanking: 1589 },
  CZE: { id: "CZE", name: "Czech Republic", group: "A", seed: 4, fifaRanking: 1501 },

  // Group B
  CAN: { id: "CAN", name: "Canada", group: "B", seed: 1, fifaRanking: 1556 },
  BIH: { id: "BIH", name: "Bosnia and Herzegovina", group: "B", seed: 2, fifaRanking: 1386 },
  QAT: { id: "QAT", name: "Qatar", group: "B", seed: 3, fifaRanking: 1455 },
  CHE: { id: "CHE", name: "Switzerland", group: "B", seed: 4, fifaRanking: 1649 },

  // Group C
  BRA: { id: "BRA", name: "Brazil", group: "C", seed: 1, fifaRanking: 1761 },
  MAR: { id: "MAR", name: "Morocco", group: "C", seed: 2, fifaRanking: 1756 },
  HTI: { id: "HTI", name: "Haiti", group: "C", seed: 3, fifaRanking: 1200 },
  SCO: { id: "SCO", name: "Scotland", group: "C", seed: 4, fifaRanking: 1498 },

  // Group D
  USA: { id: "USA", name: "United States", group: "D", seed: 1, fifaRanking: 1673 },
  PRY: { id: "PRY", name: "Paraguay", group: "D", seed: 2, fifaRanking: 1504 },
  AUS: { id: "AUS", name: "Australia", group: "D", seed: 3, fifaRanking: 1581 },
  TUR: { id: "TUR", name: "Turkey", group: "D", seed: 4, fifaRanking: 1599 },

  // Group E
  GER: { id: "GER", name: "Germany", group: "E", seed: 1, fifaRanking: 1730 },
  CUW: { id: "CUW", name: "Curaçao", group: "E", seed: 2, fifaRanking: 1295 },
  CIV: { id: "CIV", name: "Ivory Coast", group: "E", seed: 3, fifaRanking: 1533 },
  ECU: { id: "ECU", name: "Ecuador", group: "E", seed: 4, fifaRanking: 1595 },

  // Group F
  NED: { id: "NED", name: "Netherlands", group: "F", seed: 1, fifaRanking: 1758 },
  JPN: { id: "JPN", name: "Japan", group: "F", seed: 2, fifaRanking: 1660 },
  SWE: { id: "SWE", name: "Sweden", group: "F", seed: 3, fifaRanking: 1515 },
  TUN: { id: "TUN", name: "Tunisia", group: "F", seed: 4, fifaRanking: 1483 },

  // Group G
  BEL: { id: "BEL", name: "Belgium", group: "G", seed: 1, fifaRanking: 1735 },
  EGY: { id: "EGY", name: "Egypt", group: "G", seed: 2, fifaRanking: 1563 },
  IRN: { id: "IRN", name: "Iran", group: "G", seed: 3, fifaRanking: 1615 },
  NZL: { id: "NZL", name: "New Zealand", group: "G", seed: 4, fifaRanking: 1282 },

  // Group H
  ESP: { id: "ESP", name: "Spain", group: "H", seed: 1, fifaRanking: 1876 },
  CPV: { id: "CPV", name: "Cape Verde", group: "H", seed: 2, fifaRanking: 1366 },
  SAU: { id: "SAU", name: "Saudi Arabia", group: "H", seed: 3, fifaRanking: 1421 },
  URU: { id: "URU", name: "Uruguay", group: "H", seed: 4, fifaRanking: 1673 },

  // Group I
  FRA: { id: "FRA", name: "France", group: "I", seed: 1, fifaRanking: 1877 },
  SEN: { id: "SEN", name: "Senegal", group: "I", seed: 2, fifaRanking: 1689 },
  IRQ: { id: "IRQ", name: "Iraq", group: "I", seed: 3, fifaRanking: 1447 },
  NOR: { id: "NOR", name: "Norway", group: "I", seed: 4, fifaRanking: 1551 },

  // Group J
  ARG: { id: "ARG", name: "Argentina", group: "J", seed: 1, fifaRanking: 1875 },
  DZA: { id: "DZA", name: "Algeria", group: "J", seed: 2, fifaRanking: 1564 },
  AUT: { id: "AUT", name: "Austria", group: "J", seed: 3, fifaRanking: 1593 },
  JOR: { id: "JOR", name: "Jordan", group: "J", seed: 4, fifaRanking: 1391 },

  // Group K
  POR: { id: "POR", name: "Portugal", group: "K", seed: 1, fifaRanking: 1764 },
  COD: { id: "COD", name: "DR Congo", group: "K", seed: 2, fifaRanking: 1478 },
  UZB: { id: "UZB", name: "Uzbekistan", group: "K", seed: 3, fifaRanking: 1465 },
  COL: { id: "COL", name: "Colombia", group: "K", seed: 4, fifaRanking: 1693 },

  // Group L
  ENG: { id: "ENG", name: "England", group: "L", seed: 1, fifaRanking: 1826 },
  HRV: { id: "HRV", name: "Croatia", group: "L", seed: 2, fifaRanking: 1717 },
  GHA: { id: "GHA", name: "Ghana", group: "L", seed: 3, fifaRanking: 1346 },
  PAN: { id: "PAN", name: "Panama", group: "L", seed: 4, fifaRanking: 1541 },
};
