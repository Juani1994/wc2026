import { TEAMS } from "../data/teams";
import "flag-icons/css/flag-icons.min.css";

interface FlagProps {
  teamId: string;
  size?: "sm" | "md" | "lg";
}

// Mapping from ISO 3166-1 alpha-3 to alpha-2 for flag-icons
const ISO3To2: Record<string, string> = {
  MEX: "mx",
  ZAF: "za",
  KOR: "kr",
  CZE: "cz",
  CAN: "ca",
  BIH: "ba",
  QAT: "qa",
  CHE: "ch",
  BRA: "br",
  MAR: "ma",
  HTI: "ht",
  SCO: "gb-sct", // Scotland
  USA: "us",
  PRY: "py",
  AUS: "au",
  TUR: "tr",
  GER: "de",
  CUW: "cw",
  CIV: "ci",
  ECU: "ec",
  NED: "nl",
  JPN: "jp",
  SWE: "se",
  TUN: "tn",
  BEL: "be",
  EGY: "eg",
  IRN: "ir",
  NZL: "nz",
  ESP: "es",
  CPV: "cv",
  SAU: "sa",
  URU: "uy",
  FRA: "fr",
  SEN: "sn",
  IRQ: "iq",
  NOR: "no",
  ARG: "ar",
  DZA: "dz",
  AUT: "at",
  JOR: "jo",
  POR: "pt",
  COD: "cd",
  UZB: "uz",
  COL: "co",
  ENG: "gb-eng", // England
  HRV: "hr",
  GHA: "gh",
  PAN: "pa",
};

export default function Flag({ teamId, size = "md" }: FlagProps) {
  const team = TEAMS[teamId];
  if (!team) return null;

  const sizeClasses = {
    sm: "w-6 h-5",
    md: "w-8 h-6",
    lg: "w-10 h-8",
  };

  const flagCode = ISO3To2[teamId] || teamId.toLowerCase();

  return (
    <span className={`${sizeClasses[size]} fi fi-${flagCode} rounded-sm inline-block`}></span>
  );
}
