import { useState, useEffect } from 'react';
import { db, doc, onSnapshot } from '../lib/firebase';
import type { BasketballData, SquashData, AoeData, PingPongData } from '../types';

const DEFAULTS = {
  basketball: {
    torneosPrevios: { nico: 6, nicoCanjados: 4, alan: 0, alanCanjados: 0 },
    torneoActual: { nico: 7, alan: 2 },
    fechaActual: { number: 10, nico: 0, alan: 0 },
  } as BasketballData,
  squash: { fechas: { nico: 2, alan: 1 }, torneos: { nico: 0, alan: 0 } } as SquashData,
  aoe: { fechas: { nico: 38, alan: 36 }, torneos: { nico: 1, alan: 0 } } as AoeData,
  pingpong: { fechas: { nico: 5, alan: 3 } } as PingPongData,
};

export function useBasketball() {
  const [data, setData] = useState<BasketballData>(DEFAULTS.basketball);
  useEffect(() => {
    return onSnapshot(doc(db, 'scores', 'basketball'), (snap) => {
      if (snap.exists()) setData(snap.data() as BasketballData);
    });
  }, []);
  return data;
}

export function useSquash() {
  const [data, setData] = useState<SquashData>(DEFAULTS.squash);
  useEffect(() => {
    return onSnapshot(doc(db, 'scores', 'squash'), (snap) => {
      if (snap.exists()) setData(snap.data() as SquashData);
    });
  }, []);
  return data;
}

export function useAoe() {
  const [data, setData] = useState<AoeData>(DEFAULTS.aoe);
  useEffect(() => {
    return onSnapshot(doc(db, 'scores', 'aoe'), (snap) => {
      if (snap.exists()) setData(snap.data() as AoeData);
    });
  }, []);
  return data;
}

export function usePingPong() {
  const [data, setData] = useState<PingPongData>(DEFAULTS.pingpong);
  useEffect(() => {
    return onSnapshot(doc(db, 'scores', 'pingpong'), (snap) => {
      if (snap.exists()) setData(snap.data() as PingPongData);
    });
  }, []);
  return data;
}
