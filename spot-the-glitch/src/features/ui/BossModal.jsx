import React from 'react';

export const BossModal = ({ boss, onStart }) => {
  if (!boss) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl">
      <div className="max-w-lg w-full text-center border-y-4 border-rose-600 bg-slate-900/50 p-8 relative overflow-hidden">
        {/* Animated Background Noise */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==")', backgroundSize: '4px 4px' }}>
        </div>

        <div className="relative z-10">
          <h3 className="text-xl font-bold text-rose-500 tracking-[0.5em] uppercase mb-2 animate-pulse">Warning</h3>
          <h1 className="text-5xl md:text-6xl font-black text-white glitch-text mb-6 uppercase italic">
            {boss.name}
          </h1>
          
          <div className="text-6xl mb-6 filter drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]">
            {boss.icon}
          </div>

          <p className="text-sm md:text-base text-slate-300 font-bold mb-8 max-w-sm mx-auto leading-relaxed border-l-2 border-rose-500 pl-4 text-left">
            {boss.description}
          </p>
          
          <div className="space-y-3">
             <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Protocol</div>
             <div className="text-rose-400 font-mono text-xs">SURVIVE_AND_CLEANSE</div>
          </div>

          <button 
            onClick={onStart}
            className="mt-10 w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-sm transition-all uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:shadow-[0_0_40px_rgba(225,29,72,0.6)]"
          >
            Initiate Battle
          </button>
        </div>
      </div>
    </div>
  );
};
