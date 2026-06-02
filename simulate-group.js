import { generateMatchResult } from './src/utils/randomMatch.ts';
import { TEAMS } from './src/data/teams.ts';
import { calculateStandings } from './src/utils/standings.ts';

const GROUP_ID = 'J';
const SIMULATIONS = 10000;

// Get teams in group J
const groupTeams = Object.values(TEAMS).filter(t => t.group === GROUP_ID);

// Initialize position tracking
const positionStats = {};
groupTeams.forEach(team => {
  positionStats[team.id] = { 1: 0, 2: 0, 3: 0, 4: 0 };
});

// Run simulations
for (let sim = 0; sim < SIMULATIONS; sim++) {
  // Create matches for the group
  const matches = {};
  let matchId = 1;

  // Generate all matches (6 total: 3 matchdays x 2 matches)
  // MD1: 1v2, 3v4
  // MD2: 1v3, 2v4
  // MD3: 1v4, 2v3

  const seed1 = groupTeams.find(t => t.seed === 1);
  const seed2 = groupTeams.find(t => t.seed === 2);
  const seed3 = groupTeams.find(t => t.seed === 3);
  const seed4 = groupTeams.find(t => t.seed === 4);

  // Matchday 1
  const match1 = generateMatchResult(seed1.id, seed2.id);
  matches[`${GROUP_ID}_1_1`] = {
    id: `${GROUP_ID}_1_1`,
    group: GROUP_ID,
    matchday: 1,
    homeTeam: seed1.id,
    awayTeam: seed2.id,
    homeGoals: match1.homeGoals,
    awayGoals: match1.awayGoals,
    status: 'played'
  };

  const match2 = generateMatchResult(seed3.id, seed4.id);
  matches[`${GROUP_ID}_1_2`] = {
    id: `${GROUP_ID}_1_2`,
    group: GROUP_ID,
    matchday: 1,
    homeTeam: seed3.id,
    awayTeam: seed4.id,
    homeGoals: match2.homeGoals,
    awayGoals: match2.awayGoals,
    status: 'played'
  };

  // Matchday 2
  const match3 = generateMatchResult(seed1.id, seed3.id);
  matches[`${GROUP_ID}_2_1`] = {
    id: `${GROUP_ID}_2_1`,
    group: GROUP_ID,
    matchday: 2,
    homeTeam: seed1.id,
    awayTeam: seed3.id,
    homeGoals: match3.homeGoals,
    awayGoals: match3.awayGoals,
    status: 'played'
  };

  const match4 = generateMatchResult(seed2.id, seed4.id);
  matches[`${GROUP_ID}_2_2`] = {
    id: `${GROUP_ID}_2_2`,
    group: GROUP_ID,
    matchday: 2,
    homeTeam: seed2.id,
    awayTeam: seed4.id,
    homeGoals: match4.homeGoals,
    awayGoals: match4.awayGoals,
    status: 'played'
  };

  // Matchday 3
  const match5 = generateMatchResult(seed1.id, seed4.id);
  matches[`${GROUP_ID}_3_1`] = {
    id: `${GROUP_ID}_3_1`,
    group: GROUP_ID,
    matchday: 3,
    homeTeam: seed1.id,
    awayTeam: seed4.id,
    homeGoals: match5.homeGoals,
    awayGoals: match5.awayGoals,
    status: 'played'
  };

  const match6 = generateMatchResult(seed2.id, seed3.id);
  matches[`${GROUP_ID}_3_2`] = {
    id: `${GROUP_ID}_3_2`,
    group: GROUP_ID,
    matchday: 3,
    homeTeam: seed2.id,
    awayTeam: seed3.id,
    homeGoals: match6.homeGoals,
    awayGoals: match6.awayGoals,
    status: 'played'
  };

  // Calculate standings
  const standings = calculateStandings(GROUP_ID, matches);

  // Record positions
  standings.forEach((row, idx) => {
    const position = idx + 1;
    positionStats[row.teamId][position]++;
  });
}

// Display results
console.log(`\n📊 Grupo ${GROUP_ID} - Simulaciones: ${SIMULATIONS}\n`);
console.log('┌─────────────────┬──────────┬──────────┬──────────┬──────────┐');
console.log('│ Equipo          │    1º    │    2º    │    3º    │    4º    │');
console.log('├─────────────────┼──────────┼──────────┼──────────┼──────────┤');

const teamNames = {
  ARG: 'Argentina',
  DZA: 'Algeria',
  AUT: 'Austria',
  JOR: 'Jordan'
};

Object.keys(positionStats).forEach(teamId => {
  const stats = positionStats[teamId];
  const pos1 = ((stats[1] / SIMULATIONS) * 100).toFixed(2);
  const pos2 = ((stats[2] / SIMULATIONS) * 100).toFixed(2);
  const pos3 = ((stats[3] / SIMULATIONS) * 100).toFixed(2);
  const pos4 = ((stats[4] / SIMULATIONS) * 100).toFixed(2);

  console.log(`│ ${teamNames[teamId].padEnd(15)} │ ${pos1.padStart(6)}% │ ${pos2.padStart(6)}% │ ${pos3.padStart(6)}% │ ${pos4.padStart(6)}% │`);
});

console.log('└─────────────────┴──────────┴──────────┴──────────┴──────────┘\n');
