import { useState, useEffect } from 'react';

export const GameBoard = ({ levelData, gridSize, onCellClick, currentBoss, artifacts }) => {
  const [cellStates, setCellStates] = useState({});
  const [lensActive, setLensActive] = useState(false);

  // Reset cell states when level changes
  useEffect(() => {
    setCellStates({});
    
    // Quantum Lens Activation
    const hasLens = artifacts?.some(a => a.id === 'quantum_lens');
    if (hasLens) {
      setLensActive(true);
      const timer = setTimeout(() => setLensActive(false), 200);
      return () => clearTimeout(timer);
    }
  }, [levelData, artifacts]);

  const handleClick = (index, cellData) => {
    if (cellStates[index]) return; // Already clicked
    
    const success = onCellClick(cellData);
    
    setCellStates(prev => ({
      ...prev,
      [index]: success ? 'found' : 'wrong'
    }));
  };

  // Adjusted for responsive grid (was 450)
  const fontSize = Math.max(8, Math.min(32, 300 / gridSize));
  
  // Boss Mechanics CSS
  const isFog = currentBoss?.mechanic === 'fog_of_war';
  const isStrobe = currentBoss?.mechanic === 'strobe';

  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <div 
      className={`grid-container z-10 relative ${isStrobe ? 'animate-strobe' : ''}`}
      style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      onMouseLeave={() => setHoveredIdx(null)}
    >
      {levelData.cells.map((cellData, index) => {
        const state = cellStates[index];
        const isAnomaly = cellData.isAnomaly;
        
        // Quantum Lens Effect
        const lensHighlight = lensActive && isAnomaly;

        // Void (Fog) Area Reveal Logic
        let revealed = true;
        if (isFog && !state) {
            revealed = false; // Default hidden
            
            // Check if within hover radius (approx 4x4 area, so radius 1 or 2?)
            // Radius 1 = 3x3. Radius 2 = 5x5.
            if (hoveredIdx !== null) {
                const centerRow = Math.floor(hoveredIdx / gridSize);
                const centerCol = hoveredIdx % gridSize;
                const myRow = Math.floor(index / gridSize);
                const myCol = index % gridSize;
                
                // Reveal 3x3 or slightly larger
                if (Math.abs(centerRow - myRow) <= 1 && Math.abs(centerCol - myCol) <= 1) {
                    revealed = true;
                }
            }
        }

        const classes = [
          'cell',
          currentBoss && !state && !cellData.isCleansed ? '!bg-red-950/40 !border-red-500/30 !text-red-100 shadow-[inset_0_0_10px_rgba(220,38,38,0.2)]' : '',
          cellData.isCleansed && 'cleansed',
          state === 'wrong' && 'wrong',
          state === 'found' && 'found',
          isFog && !state && !revealed && 'fog-obscured',
          lensHighlight && 'lens-target'
        ].filter(Boolean).join(' ');

        return (
          <div
            key={index}
            className={classes}
            style={{ fontSize: `${fontSize}px` }}
            onClick={() => !cellData.isCleansed && handleClick(index, cellData)}
            onMouseEnter={() => setHoveredIdx(index)}
          >
            <span className={`font-black ${levelData.charType === 'custom' ? 'custom-font' : ''} ${isFog && !state && !revealed ? 'opacity-0' : 'opacity-100'} transition-opacity`}> 
              {cellData.char}
            </span>
          </div>
        );
      })}
    </div>
  );
};
