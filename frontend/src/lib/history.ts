import { db, addDoc, collection, serverTimestamp } from './firebase';
import { getStoredName } from '../hooks/usePlayerName';

export async function logHistory(sport: string, action: string): Promise<void> {
  await addDoc(collection(db, 'scores', sport, 'history'), {
    action,
    author: getStoredName(),
    timestamp: serverTimestamp(),
  });
}
