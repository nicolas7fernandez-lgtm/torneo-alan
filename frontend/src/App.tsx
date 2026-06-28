import React, { useState } from 'react';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Basketball from './components/Basketball';
import Squash from './components/Squash';
import AgeOfEmpires from './components/AgeOfEmpires';
import PingPong from './components/PingPong';
import NamePrompt from './components/NamePrompt';
import SplashScreen from './components/SplashScreen';
import PlayerSelect from './components/PlayerSelect';
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
  const [currentUser, setCurrentUser] = useState<'nico' | 'alan' | null>(null);
  const { muted, toggle, start } = useBackgroundMusic('/Furious Angels - Rob Dougan Matrix Reloaded (1).mp3');

  const switchUser = (u: 'nico' | 'alan') => {
    setCurrentUser(u);
    localStorage.setItem('torneo-user', u);
  };

  return (
    <div className="min-h-screen text-white relative">
      <video
        autoPlay loop muted playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10 opacity-60"
        src="/The Matrix Code thing Render - CrystalPanda (720p) (1).mp4"
      />
      <div className="fixed inset-0 bg-black/35 -z-10" />

      <NamePrompt />

      {/* Current user toggle — top left */}
      <div className="fixed top-3 left-3 z-40 flex rounded-full bg-black/50 border border-white/10 backdrop-blur overflow-hidden text-xs font-bold">
        <button
          onClick={() => switchUser('nico')}
          className={`px-3 py-1.5 transition-colors active:opacity-70 ${currentUser === 'nico' ? 'bg-violet-700 text-white' : 'text-gray-500'}`}
        >
          Nico
        </button>
        <button
          onClick={() => switchUser('alan')}
          className={`px-3 py-1.5 transition-colors active:opacity-70 ${currentUser === 'alan' ? 'bg-sky-700 text-white' : 'text-gray-500'}`}
        >
          Alan
        </button>
      </div>

      <button
        onClick={toggle}
        className="fixed top-3 right-3 z-40 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 border border-green-900/50 backdrop-blur text-base active:scale-90 transition-transform"
      >
        {muted ? '🔇' : '🎵'}
      </button>

      <main
        className="max-w-md mx-auto"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6rem)',
        }}
      >
        {VIEWS[sport]}
      </main>
      <NavBar active={sport} onChange={setSport} />

      {!splashDone && (
        <SplashScreen
          onEnter={start}
          onDone={() => setSplashDone(true)}
        />
      )}

      {!currentUser && (
        <PlayerSelect onSelect={switchUser} />
      )}
    </div>
  );
}
