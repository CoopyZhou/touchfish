import React from 'react';
import { Settings, MousePointer2, Fish, Activity, Palette } from 'lucide-react';
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
        className="absolute top-6 right-6 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/30 transition-all shadow-lg border border-white/30 z-50 hover:scale-110 active:scale-95"
      >
        <Settings size={24} />
      </button>
    );
  }

  return (
    <div className="absolute top-6 right-6 w-80 bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/20 text-white shadow-2xl p-6 z-50 animate-fade-in transition-all">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-pink-200">
            <span className="text-pink-400">TouchFish</span> Controls
        </h2>
        <button 
            onClick={() => setIsOpen(false)}
            className="text-white/60 hover:text-white transition-colors text-sm font-medium bg-white/5 px-3 py-1 rounded-full hover:bg-white/10"
        >
            Close
        </button>
      </div>

      <div className="space-y-6">
        {/* Interaction Mode */}
        <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-pink-200/70 flex items-center gap-2">
                <MousePointer2 size={14} /> Interaction
            </label>
            <div className="grid grid-cols-3 gap-2">
                {(Object.keys(InteractionMode) as Array<keyof typeof InteractionMode>).map((mode) => (
                    <button
                        key={mode}
                        onClick={() => setConfig(prev => ({ ...prev, interactionMode: InteractionMode[mode] }))}
                        className={`text-xs py-2 rounded-xl border transition-all font-medium ${
                            config.interactionMode === InteractionMode[mode]
                            ? 'bg-pink-500/30 border-pink-400 text-pink-100 shadow-[0_0_10px_rgba(236,72,153,0.3)]' 
                            : 'border-white/10 hover:bg-white/10 text-slate-300'
                        }`}
                    >
                        {mode === 'ATTRACT' ? 'Feed' : mode === 'REPEL' ? 'Scare' : 'Watch'}
                    </button>
                ))}
            </div>
            <p className="text-xs text-pink-100/60 text-center italic">
                {config.interactionMode === 'ATTRACT' && "Fish flock to your cursor."}
                {config.interactionMode === 'REPEL' && "Fish swim away from danger."}
                {config.interactionMode === 'IDLE' && "Fish swim peacefully."}
            </p>
        </div>

        {/* Fish Count */}
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-pink-200/70 flex items-center gap-2">
                <Fish size={14} /> Population: {config.fishCount}
            </label>
            <input 
                type="range" 
                min="10" 
                max="300" 
                value={config.fishCount}
                onChange={(e) => setConfig(prev => ({ ...prev, fishCount: parseInt(e.target.value) }))}
                className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-pink-400"
            />
        </div>

        {/* Speed */}
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-pink-200/70 flex items-center gap-2">
                <Activity size={14} /> Speed: {config.baseSpeed}x
            </label>
            <input 
                type="range" 
                min="0.5" 
                max="5" 
                step="0.1"
                value={config.baseSpeed}
                onChange={(e) => setConfig(prev => ({ ...prev, baseSpeed: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-pink-400"
            />
        </div>

        {/* Theme */}
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-pink-200/70 flex items-center gap-2">
                <Palette size={14} /> Mood
            </label>
            <div className="flex gap-3">
                 {/* Deep Blue */}
                 <button
                    onClick={() => setConfig(prev => ({ ...prev, waterColorStart: '#0f172a', waterColorEnd: '#0ea5e9' }))}
                    className={`flex-1 h-10 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#0ea5e9] ring-2 ring-offset-2 ring-offset-slate-900 transition-transform hover:scale-105 ${config.waterColorStart === '#0f172a' ? 'ring-sky-400 scale-105' : 'ring-transparent opacity-70 hover:opacity-100'}`}
                    title="Deep Ocean"
                 />
                 {/* Dreamy Pink (Replaces Purple) */}
                 <button
                    onClick={() => setConfig(prev => ({ ...prev, waterColorStart: '#4a044e', waterColorEnd: '#f472b6' }))}
                    className={`flex-1 h-10 rounded-2xl bg-gradient-to-br from-[#4a044e] to-[#f472b6] ring-2 ring-offset-2 ring-offset-slate-900 transition-transform hover:scale-105 ${config.waterColorStart === '#4a044e' ? 'ring-pink-400 scale-105' : 'ring-transparent opacity-70 hover:opacity-100'}`}
                    title="Dreamy Pink"
                 />
                 {/* Fantasy Mint */}
                 <button
                    onClick={() => setConfig(prev => ({ ...prev, waterColorStart: '#134e4a', waterColorEnd: '#2dd4bf' }))}
                    className={`flex-1 h-10 rounded-2xl bg-gradient-to-br from-[#134e4a] to-[#2dd4bf] ring-2 ring-offset-2 ring-offset-slate-900 transition-transform hover:scale-105 ${config.waterColorStart === '#134e4a' ? 'ring-teal-400 scale-105' : 'ring-transparent opacity-70 hover:opacity-100'}`}
                    title="Fantasy Mint"
                 />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
