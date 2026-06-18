import { useState } from 'react';

const KEY = 'torneo_player_name';

export function usePlayerName() {
  const [name, setName] = useState<string>(() => localStorage.getItem(KEY) ?? '');

  const saveName = (n: string) => {
    const trimmed = n.trim();
    localStorage.setItem(KEY, trimmed);
    setName(trimmed);
  };

  return { name, saveName, needsName: !name.trim() };
}

export function getStoredName(): string {
  return localStorage.getItem(KEY) || 'Alguien';
}
