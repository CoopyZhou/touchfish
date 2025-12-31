import React, { useState } from 'react';
import UnderwaterCanvas from './components/UnderwaterCanvas';
import Controls from './components/Controls';
import { SimulationConfig, InteractionMode } from './types';
import { DEFAULT_CONFIG } from './constants';
import { Sparkles } from 'lucide-react';

function App() {
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);
  const [showTip, setShowTip] = useState(true);

  // Hide tip after 5 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => setShowTip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-900 font-sans select-none">
      {/* Simulation Layer */}
      <UnderwaterCanvas config={config} />

      {/* UI Layer */}
      <Controls config={config} setConfig={setConfig} />

      {/* Title / Watermark */}
      <div className="absolute bottom-8 left-8 pointer-events-none opacity-60 z-10 text-white">
        <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-200 drop-shadow-lg flex items-center gap-3">
          TouchFish
          <Sparkles className="text-pink-300 animate-pulse" size={32} />
        </h1>
        <p className="text-lg text-pink-100/80 font-medium tracking-wide mt-1">
          Dreamy Ocean
        </p>
      </div>

      {/* Instructions Tip */}
      <div 
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl px-8 py-4 rounded-full text-white font-medium border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-opacity duration-1000 pointer-events-none flex items-center gap-3 ${showTip ? 'opacity-100' : 'opacity-0'}`}
      >
        <Sparkles size={18} className="text-pink-300" />
        <span className="tracking-wide">Click to create magic bubbles!</span>
      </div>
    </div>
  );
}

export default App;
