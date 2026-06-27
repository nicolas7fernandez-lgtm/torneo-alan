const sounds = {
  nico: [new Audio('/bien-papa.ogg'), new Audio('/pavo-navidad.ogg')],
  alan: [new Audio('/te-entro.ogg'), new Audio('/bien-tigre.ogg')],
};
sounds.nico.forEach(a => { a.volume = 0.9; });
sounds.alan.forEach(a => { a.volume = 0.9; });

export function playScoreSound(player: 'nico' | 'alan') {
  const pool = sounds[player];
  const audio = pool[Math.floor(Math.random() * pool.length)];
  audio.currentTime = 0;
  audio.play().catch(() => {});
}
