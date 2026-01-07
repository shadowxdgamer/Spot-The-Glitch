import { useState, useEffect } from 'react';
import { Settings, Github, Coffee, Maximize, Minimize } from 'lucide-react';
import { useAudio } from '../audio/useAudio';

export const StartModal = ({ onStart }) => {
  const [showSettings, setShowSettings] = useState(false);
  const audioEngine = useAudio();
  const [bgmVol, setBgmVol] = useState(30);
  const [sfxVol, setSfxVol] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

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
        <div className="bg-slate-900/90 p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center border-t-2 border-slate-500/50 ring-1 ring-white/10">
           <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest phosphor-text">Settings</h2>
           
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden">
      {/* Background Decor from game.html */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.15)_0%,transparent_80%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px]" />
        <div className="absolute w-full h-[100px] animate-scanline bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none" />
      </div>

      <div className="bg-slate-900/95 p-10 rounded-[2rem] shadow-2xl max-w-md w-full text-center border-t-4 border-cyan-500/50 shadow-cyan-900/20 z-20 backdrop-blur-2xl ring-1 ring-white/10 relative">
        
        {/* Settings Icon */}
        <button 
           onClick={() => setShowSettings(true)}
           className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors z-30"
        >
           <Settings size={20} />
        </button>

        {/* Fullscreen Toggle - Top Left */}
        <button 
          onClick={toggleFullscreen}
          className="absolute top-6 left-6 text-slate-500 hover:text-white transition-colors z-30"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>

        <h1 className="text-5xl font-black mb-1 text-cyan-400 italic glitch-text tracking-tighter uppercase">
          Spot the Glitch
        </h1>
        <p className="text-[10px] tracking-[0.5em] text-slate-500 mb-8 uppercase font-bold">
          Sector Audit Node 2.0
        </p>
        
        <div className="text-left text-[11px] text-slate-400 space-y-3 mb-8 bg-black/50 p-6 rounded-2xl border border-white/10 font-bold leading-relaxed shadow-inner">
          <p className="text-cyan-500 opacity-80 animate-pulse">{">"} SYSTEM STATUS: BREACHED</p>
          <p>{">"} TASK: IDENTIFY DATA ANOMALIES</p>
          <p>{">"} REWARD: PROTOCOL UPGRADES (LVL 5+)</p>
          <p>{">"} WARNING: LEVEL 10+ REACHES CORE BREACH</p>
        </div>

        <button 
          onClick={onStart}
          className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-2xl uppercase tracking-widest shadow-xl shadow-cyan-900/40 transition-all active:scale-95 group relative overflow-hidden mb-6"
        >
          <span className="relative z-10">Initiate Link</span>
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
        </button>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 border-t border-slate-800">
           <a 
             href="https://github.com/shadowxdgamer/Spot-The-Glitch" 
             target="_blank" 
             rel="noreferrer"
             className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors"
           >
             <Github size={14} /> 
             GitHub
           </a>
           <a 
             href="https://buymeacoffee.com/yourusername" 
             target="_blank" 
             rel="noreferrer"
             className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-lg text-xs font-bold transition-colors"
           >
             <Coffee size={14} /> 
             Support Dev
           </a>
        </div>
      </div>
    </div>
  );
};
