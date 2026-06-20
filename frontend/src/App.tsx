import React, { useState } from 'react';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Basketball from './components/Basketball';
import Squash from './components/Squash';
import AgeOfEmpires from './components/AgeOfEmpires';
import PingPong from './components/PingPong';
import NamePrompt from './components/NamePrompt';
import { useBackgroundMusic } from './hooks/useBackgroundMusic';
import type { Sport } from './types';

const VIEWS: Record<Sport, React.ReactElement> = {
  home: <Home />,
  basketball: <Basketball />,
  squash: <Squash />,
  aoe: <AgeOfEmpires />,
  pingpong: <PingPong />,
};

export default function App() {
  const [sport, setSport] = useState<Sport>('home');
  const { muted, toggle } = useBackgroundMusic('/Furious Angels - Rob Dougan Matrix Reloaded (1).mp3');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NamePrompt />

      {/* Music toggle — top right corner */}
      <button
        onClick={toggle}
        className="fixed top-3 right-3 z-40 w-9 h-9 flex items-center justify-center rounded-full bg-gray-800/80 backdrop-blur text-base active:scale-90 transition-transform"
        title={muted ? 'Activar música' : 'Silenciar música'}
      >
        {muted ? '🔇' : '🎵'}
      </button>

      <main className="pb-24 pt-2 max-w-md mx-auto">{VIEWS[sport]}</main>
      <NavBar active={sport} onChange={setSport} />
    </div>
  );
}
