import React from 'react';
import { Settings, MousePointer2, Fish, Activity, Sun, AlertCircle } from 'lucide-react';
import { InteractionMode, SimulationConfig } from '../types';

interface ControlsProps {
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
}

const Controls: React.FC<ControlsProps> = ({ config, setConfig }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/20 transition-all shadow-lg border border-white/20 z-50"
      >
        <Settings size={24} />
      </button>
    );
  }

  return (
    <div className="absolute top-4 right-4 w-80 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 text-white shadow-2xl p-6 z-50 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-cyan-400">Lumina</span> Controls
        </h2>
        <button 
            onClick={() => setIsOpen(false)}
            className="text-white/50 hover:text-white transition-colors"
        >
            Close
        </button>
      </div>

      <div className="space-y-6">
        {/* Interaction Mode */}
        <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MousePointer2 size={14} /> Mouse Interaction
            </label>
            <div className="grid grid-cols-3 gap-2">
                {(Object.keys(InteractionMode) as Array<keyof typeof InteractionMode>).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setConfig(prev => ({ ...prev, interactionMode: InteractionMode[mode] }))}
                        className={`text-xs py-2 rounded-lg border transition-all ${
                            config.interactionMode === InteractionMode[mode]
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' 
                            : 'border-white/10 hover:bg-white/5 text-slate-400'
                        }`}
                    >
                        {mode === 'ATTRACT' ? 'Feed' : mode === 'REPEL' ? 'Scare' : 'Watch'}
                    </button>
                ))}
            </div>
            <p className="text-xs text-slate-500">
                {config.interactionMode === 'ATTRACT' && "Fish will flock to your cursor."}
                {config.interactionMode === 'REPEL' && "Fish will swim away from danger."}
                {config.interactionMode === 'IDLE' && "Fish ignore the cursor."}
            </p>
        </div>

        {/* Fish Count */}
        <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Fish size={14} /> Fish Population: {config.fishCount}
            </label>
            <input 
                type="range" 
                min="10" 
                max="300" 
                value={config.fishCount}
                onChange={(e) => setConfig(prev => ({ ...prev, fishCount: parseInt(e.target.value) }))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
        </div>

        {/* Speed */}
        <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Activity size={14} /> Simulation Speed: {config.baseSpeed}x
            </label>
            <input 
                type="range" 
                min="0.5" 
                max="5" 
                step="0.1"
                value={config.baseSpeed}
                onChange={(e) => setConfig(prev => ({ ...prev, baseSpeed: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
        </div>

        {/* Theme */}
        <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sun size={14} /> Water Depth
            </label>
            <div className="flex gap-2">
                 <button
                    onClick={() => setConfig(prev => ({ ...prev, waterColorStart: '#001e3c', waterColorEnd: '#006064' }))}
                    className={`flex-1 h-8 rounded-md bg-gradient-to-r from-[#001e3c] to-[#006064] ring-2 ring-offset-2 ring-offset-slate-900 ${config.waterColorEnd === '#006064' ? 'ring-cyan-500' : 'ring-transparent'}`}
                 />
                 <button
                    onClick={() => setConfig(prev => ({ ...prev, waterColorStart: '#1e1b4b', waterColorEnd: '#4c1d95' }))}
                    className={`flex-1 h-8 rounded-md bg-gradient-to-r from-[#1e1b4b] to-[#4c1d95] ring-2 ring-offset-2 ring-offset-slate-900 ${config.waterColorEnd === '#4c1d95' ? 'ring-purple-500' : 'ring-transparent'}`}
                 />
                 <button
                    onClick={() => setConfig(prev => ({ ...prev, waterColorStart: '#022c22', waterColorEnd: '#0d9488' }))}
                    className={`flex-1 h-8 rounded-md bg-gradient-to-r from-[#022c22] to-[#0d9488] ring-2 ring-offset-2 ring-offset-slate-900 ${config.waterColorEnd === '#0d9488' ? 'ring-teal-500' : 'ring-transparent'}`}
                 />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
