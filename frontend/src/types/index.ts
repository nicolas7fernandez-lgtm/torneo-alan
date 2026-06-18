export interface PlayerScore {
  nico: number;
  alan: number;
}

export interface BasketballData {
  torneosPrevios: {
    nico: number;
    nicoCanjados: number;
    alan: number;
    alanCanjados: number;
  };
  torneoActual: PlayerScore;
  fechaActual: PlayerScore & { number: number };
}

export interface SquashData {
  fechas: PlayerScore;
  torneos: PlayerScore;
}

export interface AoeData {
  fechas: PlayerScore;
  torneos: PlayerScore;
}

export interface PingPongData {
  fechas: PlayerScore;
}

export interface AllScores {
  basketball: BasketballData;
  squash: SquashData;
  aoe: AoeData;
  pingpong: PingPongData;
}

export type Sport = 'home' | 'basketball' | 'squash' | 'aoe' | 'pingpong';
export type Player = 'nico' | 'alan';

export interface HistoryEntry {
  id: string;
  action: string;
  author: string;
  timestamp: { seconds: number; nanoseconds: number } | null;
}
