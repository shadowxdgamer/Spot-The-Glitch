import { useState, useEffect, useCallback } from 'react';
import { useAudio } from './features/audio/useAudio';
import { useGameState } from './features/game/useGameState';
import { useHighScore } from './hooks/useLocalStorage';
import { HUD } from './features/ui/HUD';
import { StartModal } from './features/ui/StartModal';
import { GameOverModal } from './features/ui/GameOverModal';
import { GameBoard } from './features/game/GameBoard';
import { ProtocolShop } from './features/shop/ProtocolShop';
import './styles/game.css';

function App() {
  const [gamePhase, setGamePhase] = useState('start'); // 'start' | 'playing' | 'shop' | 'gameOver'
  const [levelData, setLevelData] = useState(null);
  const [regenerateTrigger, setRegenerateTrigger] = useState(0);
  const { highScore, updateHighScore } = useHighScore();
  const audioEngine = useAudio();

  const handleGameOver = useCallback((finalScore) => {
    updateHighScore(finalScore);
    audioEngine.stopBGM();
    setGamePhase('gameOver');
  }, [updateHighScore, audioEngine]);

  const handleLevelComplete = useCallback(() => {
    setGamePhase('checkLevel');
  }, []);

  const {
    gameState,
    shopFreeRerollUsed,
    setShopFreeRerollUsed,
    generateLevelData,
    handleCellClick,
    startLevel,
    nextLevel,
    applyProtocol,
    consumeReroll,
    resetGame
  } = useGameState(audioEngine, handleGameOver, handleLevelComplete);

  // Handle level progression after state is available
  useEffect(() => {
    if (gamePhase === 'checkLevel') {
      if (gameState.level % 5 === 0) {
        audioEngine.sfx.card();
        setGamePhase('shop');
      } else {
        setGamePhase('processing');
        nextLevel();
        setTimeout(() => {
          const newLevelData = generateLevelData();
          setLevelData(newLevelData);
          startLevel();
          setGamePhase('playing');
        }, 0);
      }
    }
  }, [gamePhase, gameState.level, audioEngine, nextLevel, generateLevelData, startLevel]);

  // Regenerate board when triggered (shop upgrades or time expiration)
  useEffect(() => {
    if (regenerateTrigger > 0 && gamePhase === 'playing') {
      const newLevelData = generateLevelData();
      setLevelData(newLevelData);
    }
  }, [regenerateTrigger, gamePhase, generateLevelData]);

  // Handle shouldRegenerate flag from timer expiration
  useEffect(() => {
    if (gameState.shouldRegenerate && gamePhase === 'playing') {
      setRegenerateTrigger(prev => prev + 1);
    }
  }, [gameState.shouldRegenerate, gamePhase]);

  // Start game from start modal
  const handleStartGame = async () => {
    audioEngine.init();
    await audioEngine.playBGM(); // Start BGM on user interaction
    setGamePhase('playing');
    const newLevelData = generateLevelData();
    setLevelData(newLevelData);
    startLevel();
  };

  // Restart after game over
  const handleRestart = () => {
    resetGame();
    setGamePhase('playing');
    const newLevelData = generateLevelData();
    setLevelData(newLevelData);
    startLevel();
    audioEngine.playBGM();
  };

  // Apply protocol and continue
  const handleSelectProtocol = (mod) => {
    applyProtocol(mod, (updatedState) => {
      setShopFreeRerollUsed(false);
      setGamePhase('playing');
      // Force immediate regeneration with trigger
      setRegenerateTrigger(prev => prev + 1);
      startLevel();
    });
  };

  // Reroll shop
  const handleReroll = () => {
    if (!shopFreeRerollUsed) {
      setShopFreeRerollUsed(true);
    } else if (gameState.rerolls > 0) {
      consumeReroll();
    }
  };

  // Prevent multi-touch
  useEffect(() => {
    const preventMultiTouch = (e) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener('touchstart', preventMultiTouch, { passive: false });
    return () => document.removeEventListener('touchstart', preventMultiTouch);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 h-screen">
      {gamePhase === 'start' && <StartModal onStart={handleStartGame} />}
      
      {gamePhase === 'gameOver' && (
        <GameOverModal 
          score={gameState.score} 
          highScore={highScore}
          onRestart={handleRestart} 
        />
      )}

      {gamePhase === 'shop' && (
        <ProtocolShop
          gameState={gameState}
          shopFreeRerollUsed={shopFreeRerollUsed}
          onSelectMod={handleSelectProtocol}
          onReroll={handleReroll}
          audioEngine={audioEngine}
        />
      )}

      {(gamePhase !== 'start' && gamePhase !== 'gameOver') && (
        <>
          <HUD gameState={gameState} />
          {levelData && (
            <GameBoard
              levelData={levelData}
              gridSize={gameState.gridSize}
              onCellClick={handleCellClick}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
