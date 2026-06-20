import React, { useState } from 'react';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Basketball from './components/Basketball';
import Squash from './components/Squash';
import AgeOfEmpires from './components/AgeOfEmpires';
import PingPong from './components/PingPong';
import NamePrompt from './components/NamePrompt';
import SplashScreen from './components/SplashScreen';
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
  const [splashDone, setSplashDone] = useState(false);
  const { muted, toggle, start } = useBackgroundMusic('/Furious Angels - Rob Dougan Matrix Reloaded (1).mp3');

  return (
    <div className="min-h-screen text-white relative">
      <video
        autoPlay loop muted playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10 opacity-60"
        src="/The Matrix Code thing Render - CrystalPanda (720p) (1).mp4"
      />
      <div className="fixed inset-0 bg-black/35 -z-10" />

      <NamePrompt />

      <button
        onClick={toggle}
        className="fixed top-3 right-3 z-40 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 border border-green-900/50 backdrop-blur text-base active:scale-90 transition-transform"
      >
        {muted ? '🔇' : '🎵'}
      </button>

      <main className="pb-24 pt-2 max-w-md mx-auto">{VIEWS[sport]}</main>
      <NavBar active={sport} onChange={setSport} />

      {!splashDone && (
        <SplashScreen
          onEnter={start}
          onDone={() => setSplashDone(true)}
        />
      )}
    </div>
  );
}
