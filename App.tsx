import React, { useState } from 'react';
import UnderwaterCanvas from './components/UnderwaterCanvas';
import Controls from './components/Controls';
import { SimulationConfig, InteractionMode } from './types';
import { DEFAULT_CONFIG } from './constants';
import { Info } from 'lucide-react';

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
      <div className="absolute bottom-6 left-6 pointer-events-none opacity-50 z-10">
        <h1 className="text-4xl font-black text-white tracking-tighter mix-blend-overlay">
          LUMINA
        </h1>
        <p className="text-sm text-cyan-200 font-light tracking-widest uppercase">
          Interactive Generative Ocean
        </p>
      </div>

      {/* Instructions Tip */}
      <div 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full text-white/90 text-sm font-medium border border-white/10 shadow-xl transition-opacity duration-1000 pointer-events-none flex items-center gap-2 ${showTip ? 'opacity-100' : 'opacity-0'}`}
      >
        <Info size={16} className="text-cyan-400" />
        Click anywhere to create bubbles!
      </div>
    </div>
  );
}

export default App;
