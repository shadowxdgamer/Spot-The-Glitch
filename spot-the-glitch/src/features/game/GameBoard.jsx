import { useState, useEffect } from 'react';

export const GameBoard = ({ levelData, gridSize, onCellClick }) => {
  const [cellStates, setCellStates] = useState({});

  // Reset cell states when level changes
  useEffect(() => {
    setCellStates({});
  }, [levelData]);

  const handleClick = (index, cellData) => {
    if (cellStates[index]) return; // Already clicked
    
    const success = onCellClick(cellData);
    
    setCellStates(prev => ({
      ...prev,
      [index]: success ? 'found' : 'wrong'
    }));
  };

  const fontSize = Math.max(10, Math.min(32, 450 / gridSize));

  return (
    <div 
      className="grid-container z-10"
      style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
    >
      {levelData.cells.map((cellData, index) => {
        const state = cellStates[index];
        const classes = [
          'cell',
          cellData.isCleansed && 'cleansed',
          state === 'wrong' && 'wrong',
          state === 'found' && 'found'
        ].filter(Boolean).join(' ');

        return (
          <div
            key={index}
            className={classes}
            style={{ fontSize: `${fontSize}px` }}
            onClick={() => !cellData.isCleansed && handleClick(index, cellData)}
          >
            <span className={`font-black ${levelData.charType === 'custom' ? 'custom-font' : ''}`}>
              {cellData.char}
            </span>
          </div>
        );
      })}
    </div>
  );
};
