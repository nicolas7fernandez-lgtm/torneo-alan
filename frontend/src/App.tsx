import React, { useState } from 'react';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Basketball from './components/Basketball';
import Squash from './components/Squash';
import AgeOfEmpires from './components/AgeOfEmpires';
import PingPong from './components/PingPong';
import NamePrompt from './components/NamePrompt';
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <NamePrompt />
      <main className="pb-24 pt-2 max-w-md mx-auto">{VIEWS[sport]}</main>
      <NavBar active={sport} onChange={setSport} />
    </div>
  );
}
