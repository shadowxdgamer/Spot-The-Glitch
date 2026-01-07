import { useState, useEffect, useCallback } from 'react';
import { useAudio } from './features/audio/useAudio';
import { useGameState } from './features/game/useGameState';
import { useHighScore } from './hooks/useLocalStorage';
import { HUD } from './features/ui/HUD';
import { StartModal } from './features/ui/StartModal';
import { GameOverModal } from './features/ui/GameOverModal';
import { GameBoard } from './features/game/GameBoard';
import { ProtocolShop } from './features/shop/ProtocolShop';
import { BossModal } from './features/ui/BossModal';
import { ArtifactModal } from './features/ui/ArtifactModal';
import { BOSSES, ARTIFACTS } from './features/boss/bossConstants';
import { isBossLevel } from './features/game/constants';
import { DebugMenu } from './features/debug/DebugMenu';
import './styles/game.css';

function App() {
  const [gamePhase, setGamePhase] = useState('start'); // 'start' | 'playing' | 'shop' | 'gameOver'
  const [levelData, setLevelData] = useState(null);
  const [regenerateTrigger, setRegenerateTrigger] = useState(0); // Kept for Shop updates primarily if needed

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
    resetGame,
    currentBoss,
    setCurrentBoss,
    artifacts,
    addArtifact,
    markRegenerated
  } = useGameState(audioEngine, handleGameOver, handleLevelComplete);

  // Handle level progression after state is available
  useEffect(() => {
    if (gamePhase === 'checkLevel') {
      // Check if we just finished a boss level
      if (isBossLevel(gameState.level)) {
        audioEngine.sfx.success(); // Or special sound
        setGamePhase('artifactReward');
      } 
      // Check if shop (every 5 levels, except boss levels handled above)
      else if (gameState.level % 5 === 0) {
        audioEngine.sfx.card();
        setGamePhase('shop');
      } 
      else {
        setGamePhase('processing');
        // We calculate next level here
        const nextLvl = gameState.level + 1;
        
        // Check if UPCOMING level is a Boss Level
        if (isBossLevel(nextLvl)) {
           const bossKeys = Object.keys(BOSSES);
           const randomBossKey = bossKeys[Math.floor(Math.random() * bossKeys.length)];
           setCurrentBoss(BOSSES[randomBossKey]);
           
           nextLevel();
           setGamePhase('bossWarning');
        } else {
           setCurrentBoss(null);
           nextLevel();
           setTimeout(() => {
              const newLevelData = generateLevelData();
              setLevelData(newLevelData);
              startLevel();
              setGamePhase('playing');
           }, 0);
        }
      }
    }
  }, [gamePhase, gameState.level, audioEngine, nextLevel, generateLevelData, startLevel, setCurrentBoss]);

  // Start Boss Level
  const handleBossStart = () => {
    audioEngine.sfx.click();
    const newLevelData = generateLevelData();
    setLevelData(newLevelData);
    startLevel();
    setGamePhase('playing');
  };

  // Select Artifact and Continue
  const handleArtifactSelect = (artifact) => {
    audioEngine.sfx.success();
    const newArtifacts = [...artifacts, artifact];
    addArtifact(artifact);
    setCurrentBoss(null); // Clear boss state
    setGamePhase('processing');
    nextLevel();
    setTimeout(() => {
      const newLevelData = generateLevelData();
      setLevelData(newLevelData);
      startLevel(newArtifacts); // Pass new artifacts explicitly
      setGamePhase('playing');
    }, 0);
  };


  // Regenerate board when triggered (shop upgrades, boss hits, or time expiration)
  useEffect(() => {
    if (gamePhase === 'playing' && (gameState.shouldRegenerate || regenerateTrigger > 0)) {
      const newLevelData = generateLevelData();
      setLevelData(newLevelData);
      if (gameState.shouldRegenerate) {
        markRegenerated();
      }
    }
  }, [gameState.shouldRegenerate, regenerateTrigger, gamePhase, generateLevelData, markRegenerated]);

  // Handle shouldRegenerate flag from timer expiration
  /* useEffect removed as it is now redundant with the combined effect above */

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

  // Return to home screen
  const handleHome = () => {
    resetGame();
    setGamePhase('start');
    audioEngine.stopBGM();
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

  const handleDebugProtocol = (mod) => {
    if (mod.customLevel) {
       // Manual level jump
       const target = mod.customLevel - 1; // Logic adds +1
       gameState.level = target; // Hack direct mutation for debug jump or better use setGameState
       applyProtocol({ }, () => {
         setGamePhase('processing');
         setTimeout(() => {
            // Check if boss level
            if (isBossLevel(mod.customLevel)) {
                // Find boss?
                const bossKeys = Object.keys(BOSSES);
                const randomBossKey = bossKeys[Math.floor(Math.random() * bossKeys.length)];
                setCurrentBoss(BOSSES[randomBossKey]);
                setGamePhase('bossWarning');
            } else {
                setCurrentBoss(null);
                setGamePhase('playing');
                const newLevelData = generateLevelData();
                setLevelData(newLevelData);
                startLevel();
            }
         }, 100);
       });
    } else {
       // Cheats
       applyProtocol(mod); // Time/Lives
    }
  };

  const handleDebugBoss = (boss) => {
      setCurrentBoss(boss);
      setGamePhase('bossWarning');
  };

  const handleDebugArtifact = (art) => {
      addArtifact(art);
      audioEngine.sfx.success();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 h-screen relative">
      <div className={`fixed inset-0 bg-red-950/30 pointer-events-none transition-opacity duration-1000 z-0 ${currentBoss ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* Debug Menu - Always available */}
      {/* <DebugMenu 
        gameState={gameState} 
        onApplyProtocol={handleDebugProtocol}
        onAddArtifact={handleDebugArtifact}
        onSetBoss={handleDebugBoss}
      /> */}
      
      {gamePhase === 'start' && <StartModal onStart={handleStartGame} />}
      
      {gamePhase === 'gameOver' && (
        <GameOverModal 
          score={gameState.score} 
          highScore={highScore}
          onRestart={handleRestart}
          onHome={handleHome}
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

      {gamePhase === 'bossWarning' && currentBoss && (
        <BossModal 
          boss={currentBoss} 
          onStart={handleBossStart} 
        />
      )}

      {gamePhase === 'artifactReward' && (
        <ArtifactModal 
          artifacts={ARTIFACTS} 
          onSelect={handleArtifactSelect} 
        />
      )}

      {(gamePhase !== 'start' && gamePhase !== 'gameOver' && gamePhase !== 'bossWarning' && gamePhase !== 'artifactReward') && (
        <>
          <HUD gameState={gameState} />
          {levelData && (
            <GameBoard
              levelData={levelData}
              gridSize={gameState.gridSize}
              onCellClick={handleCellClick}
              currentBoss={currentBoss}
              artifacts={artifacts}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
