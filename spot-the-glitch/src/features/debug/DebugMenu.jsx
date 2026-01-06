import React, { useState } from 'react';
import { BOSSES, ARTIFACTS } from '../boss/bossConstants';

export const DebugMenu = ({ gameState, onApplyProtocol, onAddArtifact, onSetBoss, onJumpLevel }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-1 right-1 bg-red-900 border border-red-500 text-white text-[10px] p-2 opacity-50 hover:opacity-100 z-50 rounded font-bold tracking-widest uppercase transition-opacity"
      >
        Debug Mode
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 bg-slate-900 border-2 border-slate-700 p-4 z-50 rounded-tl-xl shadow-2xl max-w-sm w-full h-[50vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-white">DEBUG CONTROL</h3>
        <button onClick={() => setIsOpen(false)} className="text-red-500 font-bold">X</button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-slate-400 block">Jump to Level</label>
          <div className="flex gap-2">
            {[10, 25, 50].map(lvl => (
              <button 
                key={lvl}
                onClick={() => onApplyProtocol({ customLevel: lvl })}
                className="px-2 py-1 bg-blue-600 rounded text-xs"
              >
                Lvl {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-400 block">Spawn Boss</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(BOSSES).map(boss => (
              <button 
                key={boss.id}
                onClick={() => onSetBoss(boss)}
                className="px-2 py-1 bg-red-900/50 border border-red-500 rounded text-xs truncate"
              >
                {boss.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-slate-400 block">Add Artifact</label>
          <div className="grid grid-cols-2 gap-2">
            {ARTIFACTS.map(art => (
              <button 
                key={art.id}
                onClick={() => onAddArtifact(art)}
                className="px-2 py-1 bg-amber-900/50 border border-amber-500 rounded text-xs truncate"
              >
                {art.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
           <label className="text-xs text-slate-400 block">Cheats</label>
           <button onClick={() => onApplyProtocol({ maxTime: 999 })} className="w-full bg-green-900 text-xs py-1 rounded">Infinite Time (+999)</button>
           <button onClick={() => onApplyProtocol({ lives: 5 })} className="w-full bg-rose-900 text-xs py-1 rounded mt-1">Add 5 Lives</button>
        </div>
      </div>
    </div>
  );
};
