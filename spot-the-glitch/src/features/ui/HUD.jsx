export const HUD = ({ gameState }) => {
  return (
    <div className="w-full max-w-lg mb-4 space-y-3 z-10">
      <div className="hud-panel p-4 flex justify-between items-center shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] text-cyan-500 font-bold tracking-[0.2em] opacity-70 uppercase">
            Sector
          </span>
          <div className="text-2xl font-black text-white">
            {gameState.level.toString().padStart(2, '0')}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-rose-500 font-bold tracking-[0.2em] opacity-70 uppercase">
            Integrity
          </span>
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
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] text-cyan-500 font-bold tracking-[0.2em] opacity-70 uppercase">
            Score
          </span>
          <div className="text-2xl font-black text-cyan-400">
            {gameState.score.toString().padStart(5, '0')}
          </div>
        </div>
      </div>

      <div className="progress-bar-container">
        <div 
          className="progress-fill" 
          style={{ width: `${Math.max(0, (gameState.timeLeft / gameState.maxTime) * 100)}%` }}
        />
      </div>

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
