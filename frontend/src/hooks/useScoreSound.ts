const preloaded: Record<string, HTMLAudioElement> = {
  '/bien-papa.ogg':    new Audio('/bien-papa.ogg'),
  '/te-entro.ogg':     new Audio('/te-entro.ogg'),
  '/pavo-navidad.ogg': new Audio('/pavo-navidad.ogg'),
  '/bien-tigre.ogg':   new Audio('/bien-tigre.ogg'),
};
Object.values(preloaded).forEach(a => { a.volume = 0.9; });

// Row = current user (who's pressing), col = who scored
const MATRIX: Record<string, Record<string, string>> = {
  nico: { nico: '/bien-papa.ogg',    alan: '/te-entro.ogg'     },
  alan: { nico: '/pavo-navidad.ogg', alan: '/bien-tigre.ogg'   },
};

export function playScoreSound(scoredPlayer: 'nico' | 'alan') {
  const user = localStorage.getItem('torneo-user') ?? 'nico';
  const src = MATRIX[user]?.[scoredPlayer] ?? '/bien-papa.ogg';
  const audio = preloaded[src];
  audio.currentTime = 0;
  audio.play().catch(() => {});
}
