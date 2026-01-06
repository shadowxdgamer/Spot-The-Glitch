import { useState } from 'react';
import { Settings, Volume2, VolumeX, Volume1, Github, Coffee } from 'lucide-react';
import { useAudio } from '../audio/useAudio';

export const StartModal = ({ onStart }) => {
  const [showSettings, setShowSettings] = useState(false);
  const audioEngine = useAudio();
  const [bgmVol, setBgmVol] = useState(30);
  const [sfxVol, setSfxVol] = useState(100);

  const handleBgmChange = (e) => {
    const val = parseInt(e.target.value);
    setBgmVol(val);
    audioEngine.setVolume('bgm', val / 100);
  };

  const handleSfxChange = (e) => {
    const val = parseInt(e.target.value);
    setSfxVol(val);
    audioEngine.setVolume('sfx', val / 100);
  };

  if (showSettings) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
        <div className="bg-slate-900/90 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border-t-2 border-slate-500/50">
           <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">Settings</h2>
           
           <div className="space-y-6 mb-8 text-left">
              <div>
                  <label className="text-xs text-slate-400 font-bold uppercase mb-2 block flex justify-between">
                     <span>Music Volume</span>
                     <span>{bgmVol}%</span>
                  </label>
                  <input 
                    type="range" min="0" max="100" value={bgmVol} onChange={handleBgmChange}
                    className="w-full accent-cyan-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
              </div>

              <div>
                  <label className="text-xs text-slate-400 font-bold uppercase mb-2 block flex justify-between">
                     <span>SFX Volume</span>
                     <span>{sfxVol}%</span>
                  </label>
                  <input 
                    type="range" min="0" max="100" value={sfxVol} onChange={handleSfxChange}
                    className="w-full accent-rose-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                  />
              </div>
           </div>

           <button 
             onClick={() => setShowSettings(false)}
             className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all uppercase tracking-widest"
           >
             Back
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900/90 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border-t-2 border-cyan-500/50 relative">
        
        {/* Settings Icon */}
        <button 
           onClick={() => setShowSettings(true)}
           className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
           <Settings size={20} />
        </button>

        <h1 className="text-4xl font-black mb-1 text-cyan-400 italic glitch-text tracking-tighter uppercase">
          Spot the Glitch
        </h1>
        <p className="text-[10px] tracking-[0.3em] text-slate-500 mb-8 uppercase font-bold">
          Neural Link Established
        </p>
        
        <div className="text-left text-xs text-slate-400 space-y-2 mb-8 bg-black/40 p-5 rounded-lg border border-white/5 font-bold leading-relaxed">
          <p className="text-cyan-500 opacity-80">&gt; Neural Link Established</p>
          <p>&gt; Scan the data array</p>
          <p>&gt; Identify non-standard artifacts</p>
          <p>&gt; Time is finite</p>
          <p>&gt; Accuracy is paramount</p>
        </div>

        <button 
          onClick={onStart}
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-cyan-900/40 mb-6"
        >
          Initiate Scan
        </button>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 border-t border-slate-800">
           <a 
             href="https://github.com/shadowxdgamer/Spot-The-Glitch" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all text-[10px] uppercase font-bold tracking-wider flex-1 group"
           >
              <Github size={16} className="group-hover:scale-110 transition-transform"/>
              <span>GitHub Repo</span>
           </a>
           <a 
             href="https://buymeacoffee.com/shadowxdgamer" 
             target="_blank" 
             rel="noopener noreferrer" 
             className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-900/10 hover:bg-yellow-900/30 text-yellow-600 hover:text-yellow-400 border border-yellow-700/20 hover:border-yellow-500/50 rounded-lg transition-all text-[10px] uppercase font-bold tracking-wider flex-1 group"
           >
              <Coffee size={16} className="group-hover:scale-110 transition-transform"/>
              <span>Support</span>
           </a>
        </div>
      </div>
    </div>
  );
};
