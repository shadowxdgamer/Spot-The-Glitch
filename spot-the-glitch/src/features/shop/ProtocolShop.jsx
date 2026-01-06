import { useState, useEffect } from 'react';
import { pickMod } from './shopConstants';

export const ProtocolShop = ({ 
  gameState, 
  shopFreeRerollUsed, 
  onSelectMod, 
  onReroll,
  audioEngine 
}) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    generateCards();
  }, []);

  const generateCards = () => {
    const newCards = [];
    for (let i = 0; i < gameState.cardsToShow; i++) {
      const mod = pickMod(gameState.level, gameState.cleansePercent, gameState.cardsToShow);
      newCards.push(mod);
    }
    setCards(newCards);
  };

  const handleReroll = () => {
    audioEngine?.sfx.click();
    onReroll();
    generateCards();
  };

  const handleSelectMod = (mod) => {
    audioEngine?.sfx.click();
    onSelectMod(mod);
  };

  const canReroll = !shopFreeRerollUsed || gameState.rerolls > 0;
  const rerollText = !shopFreeRerollUsed ? 'FREE' : gameState.rerolls;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-5xl w-full text-center">
        <h2 className="text-3xl font-black text-cyan-400 glitch-text mb-2 italic uppercase">
          Upgrade Protocol
        </h2>
        <p className="text-[10px] tracking-[0.4em] text-slate-500 uppercase mb-8">
          Select system modification
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {cards.map((mod, index) => (
            <ModCard key={index} mod={mod} onClick={() => handleSelectMod(mod)} />
          ))}
        </div>

        <button 
          onClick={handleReroll}
          disabled={!canReroll}
          className="reroll-btn px-8 py-3 rounded-full text-xs font-black text-white uppercase tracking-widest"
        >
          Reroll Protocol ({rerollText})
        </button>
      </div>
    </div>
  );
};

const ModCard = ({ mod, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`choice-card p-6 rounded-xl flex flex-col justify-between rarity-${mod.r.toLowerCase()}`}
    >
      <div>
        <div className="text-[9px] uppercase tracking-widest mb-3 opacity-50 font-bold">
          {mod.r} Modification
        </div>
        <div className="text-lg font-black text-emerald-400 mb-1 leading-tight">
          PRO: {mod.b}
        </div>
        <div className="text-[10px] text-slate-300 mb-4 font-bold">
          {mod.bp && `Cleanse ${mod.bp}% of grid`}
          {mod.time && `+${mod.time}s max limit`}
          {mod.time_m && `${mod.time_m}s global limit`}
          {mod.life && `+1 Stability Node`}
          {mod.slot && `+1 Choice Slot (Next)`}
          {mod.rr && `+${mod.rr} Rerolls`}
          {mod.scr && `Scramble complexity`}
        </div>
      </div>
      <div className="border-t border-white/5 pt-4">
        <div className="text-rose-500 font-bold text-[11px] uppercase tracking-tight">
          CON: {mod.c}
        </div>
        <div className="text-[9px] text-slate-500 mt-1 uppercase font-bold">
          {mod.gs && `+${mod.gs} Array Dimension`}
          {mod.anom && `+${mod.anom} Anomaly count`}
          {mod.time_m && `Reduced thinking time`}
        </div>
      </div>
    </div>
  );
};
