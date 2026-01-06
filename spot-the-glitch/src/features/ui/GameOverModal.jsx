export const GameOverModal = ({ score, highScore, onRestart }) => {
  const isNewHighScore = score >= highScore && score > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
      <div className="bg-slate-900/90 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border-t-2 border-rose-500/50">
        <h2 className="text-3xl font-black mb-1 text-rose-500 italic uppercase">
          System Crash
        </h2>
        
        <div className="mb-8 mt-6">
          <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Final Score</p>
          <div className="text-6xl font-black text-white tracking-tighter">
            {score}
          </div>
          
          {isNewHighScore && (
            <p className="text-xs text-cyan-400 font-bold mt-2 animate-pulse uppercase tracking-widest">
              ★ New High Score ★
            </p>
          )}
          
          {!isNewHighScore && highScore > 0 && (
            <p className="text-[10px] text-slate-600 font-bold mt-2 uppercase tracking-wider">
              High Score: {highScore}
            </p>
          )}
        </div>
        
        <button 
          onClick={onRestart}
          className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-black rounded-xl transition-all border border-cyan-900/50 uppercase tracking-widest"
        >
          Reboot System
        </button>
      </div>
    </div>
  );
};
