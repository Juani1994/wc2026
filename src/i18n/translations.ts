export type Language = 'en' | 'es';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'header.title': '🏆 FIFA World Cup 2026',
    'header.share': '📤 Share',
    'header.resetAll': 'Reset All',

    // Navigation
    'nav.thirdPlace': '🏅 Third Place',
    'nav.knockout': '🏆 Knockout',

    // Group Stage
    'groupStage.resetConfirm': 'Reset all results for all groups? This cannot be undone.',
    'group.title': 'Group',
    'group.standings': 'Standings',
    'group.fixtures': 'Fixtures',
    'group.matchday': 'Matchday',
    'group.randomResults': 'Random Results',
    'group.resetGroup': 'Reset Group',
    'group.resetConfirm': 'Reset all results for Group',
    'table.team': 'Team',
    'table.p': 'P',
    'table.w': 'W',
    'table.d': 'D',
    'table.l': 'L',
    'table.gf': 'GF',
    'table.ga': 'GA',
    'table.gd': 'GD',
    'table.pts': 'Pts',

    // Knockout Stage
    'knockout.combinationTitle': 'Combination of the 8 best third-place teams:',
    'knockout.combinationOf': '# / 495',
    'knockout.groupsQualified': 'Groups qualified (3rd):',
    'knockout.incompleteGroups': 'Complete the group stage to determine the official combination of the 8 best third-placed teams (1 of 495).',
    'knockout.resetKnockout': 'Reset Knockout',
    'knockout.round32': '🏁 Round of 32',
    'knockout.round16': '⚽ Round of 16',
    'knockout.quarterfinals': '🎯 Quarterfinals',
    'knockout.semifinals': '🔥 Semifinals',
    'knockout.thirdPlace': '🥉 Third Place Match',
    'knockout.final': '🏆 Final',
    'knockout.noMatches': 'Complete the groups to see the knockout bracket',

    // Best Thirds
    'thirds.combination': 'Group combinations for the 8 best third-placed teams:',
    'thirds.table': '#|Team|Grp|P|GF|GA|GD|Pts',
    'thirds.team': 'Team',
    'thirds.grp': 'Grp',
    'thirds.pj': 'P',
    'thirds.gf': 'GF',
    'thirds.gc': 'GA',
    'thirds.dg': 'GD',
    'thirds.pts': 'Pts',
    'thirds.match': 'match',
    'thirds.matches': 'matches',

    // Knockout Match
    'match.penalties': 'Penalties',
    'match.winner': 'Winner:',
    'match.tbd': 'TBD',

    // Share Modal
    'share.title': '🔗 Share Prediction',
    'share.description': 'Share your predictions with friends',
    'share.copyLink': 'Copy Link',
    'share.copy': 'Copy to Clipboard',
    'share.copied': 'Copied!',
    'share.linkNote': 'The link contains all your current predictions and will be loaded automatically when someone opens it.',
    'share.close': 'Close',

    // Common
    'common.played': 'played',
    'common.reset': 'Reset',
  },
  es: {
    // Header
    'header.title': '🏆 Copa Mundial FIFA 2026',
    'header.share': '📤 Compartir',
    'header.resetAll': 'Reset Todo',

    // Navigation
    'nav.thirdPlace': '🏅 Terceros',
    'nav.knockout': '🏆 Eliminatorias',

    // Group Stage
    'groupStage.resetConfirm': '¿Resetear todos los resultados de todos los grupos? Esto no se puede deshacer.',
    'group.title': 'Grupo',
    'group.standings': 'Clasificación',
    'group.fixtures': 'Partidos',
    'group.matchday': 'Fecha',
    'group.randomResults': 'Resultados Aleatorios',
    'group.resetGroup': 'Reset Grupo',
    'group.resetConfirm': '¿Resetear todos los resultados del Grupo',
    'table.team': 'Equipo',
    'table.p': 'PJ',
    'table.w': 'G',
    'table.d': 'E',
    'table.l': 'P',
    'table.gf': 'GF',
    'table.ga': 'GC',
    'table.gd': 'DG',
    'table.pts': 'Pts',

    // Knockout Stage
    'knockout.combinationTitle': 'Combinación de los 8 mejores terceros:',
    'knockout.combinationOf': '# / 495',
    'knockout.groupsQualified': 'Grupos clasificados (3°):',
    'knockout.incompleteGroups': 'Completa la fase de grupos para determinar la combinación oficial de los 8 mejores terceros (1 de 495).',
    'knockout.resetKnockout': 'Reset Eliminatorias',
    'knockout.round32': '🏁 16avos de Final',
    'knockout.round16': '⚽ Octavos de Final',
    'knockout.quarterfinals': '🎯 Cuartos de Final',
    'knockout.semifinals': '🔥 Semifinales',
    'knockout.thirdPlace': '🥉 Tercer Puesto',
    'knockout.final': '🏆 Final',
    'knockout.noMatches': 'Completa los grupos para ver el bracket de eliminatorias',

    // Best Thirds
    'thirds.combination': 'Combinación de grupos de los 8 mejores terceros:',
    'thirds.table': '#|Equipo|Grp|PJ|GF|GC|DG|Pts',
    'thirds.team': 'Equipo',
    'thirds.grp': 'Grp',
    'thirds.pj': 'PJ',
    'thirds.gf': 'GF',
    'thirds.gc': 'GC',
    'thirds.dg': 'DG',
    'thirds.pts': 'Pts',
    'thirds.match': 'partido',
    'thirds.matches': 'partidos',

    // Knockout Match
    'match.penalties': 'Penales',
    'match.winner': 'Ganador:',
    'match.tbd': 'Por definir',

    // Share Modal
    'share.title': '🔗 Compartir Predicción',
    'share.description': 'Comparte tus predicciones con amigos',
    'share.copyLink': 'Copiar Enlace',
    'share.copy': 'Copiar al Portapapeles',
    'share.copied': '¡Copiado!',
    'share.linkNote': 'El enlace contiene todas tus predicciones actuales y se cargará automáticamente cuando alguien lo abra.',
    'share.close': 'Cerrar',

    // Common
    'common.played': 'jugado',
    'common.reset': 'Reset',
  },
};

export type TranslationKey = keyof typeof translations['en'];

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang][key] || key;
}
