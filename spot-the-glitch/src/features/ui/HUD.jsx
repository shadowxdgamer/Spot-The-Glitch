export const HUD = ({ gameState }) => {
  const isBoss = gameState.bossLives > 0;
  const themeColor = isBoss ? 'text-rose-500' : 'text-cyan-500';
  const scoreColor = isBoss ? 'text-rose-400' : 'text-cyan-400';

  return (
    <div className="w-full max-w-lg mb-4 space-y-3 z-10 transition-colors duration-500">
      <div className={`hud-panel p-4 flex justify-between items-center shadow-lg ${isBoss ? 'border-rose-900/50 bg-red-950/20' : ''}`}>
        <div className="flex flex-col">
          <span className={`text-[10px] ${themeColor} font-bold tracking-[0.2em] opacity-70 uppercase`}>
            Sector
          </span>
          <div className="text-2xl font-black text-white">
            {gameState.level.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-rose-500 font-bold tracking-[0.2em] opacity-70 uppercase">
            {isBoss ? 'BOSS HP' : 'INTEGRITY'}
          </span>
          
          {isBoss ? (
            <div className="flex gap-2 text-xl py-1 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} style={{ opacity: i < gameState.bossLives ? 1 : 0.2 }}>
                  ☠️
                </span>
              ))}
            </div>
          ) : (
            <div className="flex gap-1 text-xl py-1">
              {Array.from({ length: gameState.maxLives }).map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < gameState.lives
                      ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end">
          <span className={`text-[10px] ${themeColor} font-bold tracking-[0.2em] opacity-70 uppercase`}>
            Score
          </span>
          <div className={`text-2xl font-black ${scoreColor}`}>
            {gameState.score.toString().padStart(5, '0')}
          </div>
        </div>
      </div>

      <div 
        className="progress-bar-container transition-all duration-300"
        style={isBoss ? { height: '16px', border: '1px solid rgba(244, 63, 94, 0.4)' } : {}}
      >
        <div 
          className="progress-fill" 
          style={{ 
            width: `${Math.max(0, (gameState.timeLeft / (gameState.maxTimeForLevel || gameState.maxTime)) * 100)}%`,
            ...(isBoss ? { 
              background: 'linear-gradient(90deg, #f43f5e, #fff)', 
              boxShadow: '0 0 20px #f43f5e' 
            } : {})
          }}
        />
      </div>{/* End Progress */} 
      
      {/* Player HP backup for Boss Mode (since we replaced Integrity with Boss HP) */}
      {isBoss && (
         <div className="flex justify-between items-center px-4">
             <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                SYSTEM INTEGRITY
             </span>
             <div className="flex gap-1">
              {Array.from({ length: gameState.maxLives }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < gameState.lives
                      ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
             </div>
         </div>
      )}

      <div className="flex justify-between items-center px-1">
        <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
          Detecting{' '}
          <span className="text-cyan-400">
            {gameState.targetsNeeded - gameState.targetsFound}
          </span>{' '}
          anomaly...
        </div>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Rerolls: <span className="text-cyan-500">{gameState.rerolls}</span>
        </div>
      </div>
    </div>
  );
};
