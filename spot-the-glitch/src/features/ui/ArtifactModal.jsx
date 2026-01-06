import React from 'react';

export const ArtifactModal = ({ artifacts, onSelect }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl">
      <div className="max-w-4xl w-full text-center">
        <h2 className="text-3xl font-black text-yellow-400 glitch-text mb-2 italic uppercase">
          System Reward
        </h2>
        <p className="text-[10px] tracking-[0.4em] text-slate-400 uppercase mb-8">
          Boss defeated / Choose Artifact
        </p>

        <div className="overflow-y-auto max-h-[70vh] p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {artifacts.map((artifact, index) => (
                <div 
                key={index}
                onClick={() => onSelect(artifact)}
                className="group cursor-pointer bg-slate-900 border border-yellow-500/20 hover:border-yellow-400 p-6 rounded-xl transition-all hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(250,204,21,0.2)] flex flex-col items-center text-center relative overflow-hidden"
                >
                <div className="absolute inset-0 bg-yellow-400/5 group-hover:bg-yellow-400/10 transition-colors"></div>
                
                <div className="text-rose-500 text-[10px] font-black tracking-widest uppercase mb-4 z-10">
                    {artifact.rarity}
                </div>
                
                <h3 className="text-xl font-black text-white mb-2 uppercase italic z-10 group-hover:text-yellow-300 transition-colors">
                    {artifact.name}
                </h3>
                
                <p className="text-xs text-slate-400 font-bold leading-relaxed z-10">
                    {artifact.description}
                </p>
                </div>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};
