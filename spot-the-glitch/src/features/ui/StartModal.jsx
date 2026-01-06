export const StartModal = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900/90 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center border-t-2 border-cyan-500/50">
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
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-xl transition-all uppercase tracking-widest shadow-lg shadow-cyan-900/40"
        >
          Initiate Scan
        </button>
      </div>
    </div>
  );
};
