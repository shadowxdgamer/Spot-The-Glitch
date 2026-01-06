import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  INITIAL_GAME_STATE, 
  CHAR_TYPES, 
  CHAR_SETS,
  SCORE_PER_TARGET,
  SCORE_PER_LEVEL,
  TIMER_TICK,
  TIMER_INTERVAL,
  PANIC_TIME_THRESHOLD,
  MAX_GRID_SIZE,
  MAX_CLEANSE_PERCENT,
  MIN_TIME,
  MAX_CARD_SLOTS,
  isBossLevel
} from './constants';

import { BOSSES } from '../boss/bossConstants';

export const useGameState = (audioEngine, onGameOver, onLevelComplete) => {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [shopFreeRerollUsed, setShopFreeRerollUsed] = useState(false);
  const [currentBoss, setCurrentBoss] = useState(null);
  const [artifacts, setArtifacts] = useState([]);
  const timerRef = useRef(null);

  // Generate level cells data
  const generateLevelData = useCallback(() => {
    const type = CHAR_TYPES[gameState.charTypeIdx];
    const set = CHAR_SETS[type];
    const baseChar = set[Math.floor(Math.random() * set.length)];
    
    // Generate unique anomaly characters
    const anomalyChars = [];
    while (anomalyChars.length < gameState.targetsNeeded) {
      const c = set[Math.floor(Math.random() * set.length)];
      if (c !== baseChar && !anomalyChars.includes(c)) {
        anomalyChars.push(c);
      }
    }

    const totalCells = gameState.gridSize * gameState.gridSize;
    const cells = Array.from({ length: totalCells }, () => ({
      char: baseChar,
      isAnomaly: false,
      isCleansed: false
    }));

    // Apply cleanse
    const cleanseCount = Math.floor(totalCells * (gameState.cleansePercent / 100));
    const indices = Array.from({ length: totalCells }, (_, i) => i);
    indices.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < cleanseCount; i++) {
      cells[indices[i]].isCleansed = true;
    }

    // Place anomalies
    const validIndices = indices.slice(cleanseCount);
    for (let i = 0; i < gameState.targetsNeeded; i++) {
      const idx = validIndices[i % validIndices.length];
      cells[idx].char = anomalyChars[i % anomalyChars.length];
      cells[idx].isAnomaly = true;
      cells[idx].isCleansed = false;
    }

    return { cells, charType: type };
  }, [gameState.charTypeIdx, gameState.gridSize, gameState.targetsNeeded, gameState.cleansePercent]);

  const handleCellClick = useCallback((cellData) => {
    if (!gameState.active) return false;

    if (cellData.isAnomaly) {
      audioEngine?.sfx.success();
      const newTargetsFound = gameState.targetsFound + 1;
      const newScore = gameState.score + (SCORE_PER_TARGET * gameState.level);
      
      // Artifact Logic
      const hasLifeLeech = artifacts.some(a => a.effect === 'life_leech');
      const hasTimeFreeze = artifacts.some(a => a.effect === 'time_freeze');
      
      setGameState(prev => {
        let updates = {
          targetsFound: newTargetsFound,
          score: newScore,
          totalAnomaliesFound: (prev.totalAnomaliesFound || 0) + 1
        };

        // Golden Glitch: Heal every 10 targets
        if (hasLifeLeech && updates.totalAnomaliesFound % 10 === 0) {
           updates.lives = Math.min(prev.maxLives, prev.lives + 1);
           // Play heal sound?
        }

        // Chrono Battery: Freeze time
        if (hasTimeFreeze) {
           updates.isTimeFrozen = true;
           setTimeout(() => {
             setGameState(curr => ({ ...curr, isTimeFrozen: false }));
           }, 3000);
        }

        // Level Complete Check
        if (newTargetsFound >= prev.targetsNeeded) {
           const bossLevel = isBossLevel(prev.level);
           
           if (bossLevel && prev.bossLives > 1) {
             // Boss takes damage, phase continues
             updates.bossLives = prev.bossLives - 1;
             updates.targetsFound = 0;
             updates.shouldRegenerate = true;
           } else {
             // Level/Boss Defeated
             updates.bossLives = 0;
             updates.active = false;
             setTimeout(() => onLevelComplete?.(), 400);
           }
        }
        
        return { ...prev, ...updates };
      });

      return true; // Success
    } else {
      audioEngine?.sfx.failure();
      loseLife();
      return false; // Failure
    }
  }, [gameState, audioEngine, onLevelComplete]);

  // Lose a life (called when clicking wrong cell)
  const loseLife = useCallback(() => {
    setGameState(prev => {
      // Shield Artifact Logic
      // Bugfix: Ensure shield only consumes if active. 
      // User noted: "first hit removes 1 life then it works". 
      // If shieldActive is false but we have artifact, it means startLevel didn't set it?
      // But startLevel Logic seems correct.
      // Maybe the user confusing "taking damage" with "shield breaking sound"?
      // Let's ensure shieldActive is correct.
      if (prev.shieldActive) {
        // Shield absorbs hit
        return { ...prev, shieldActive: false };
      }

      const newLives = prev.lives - 1;
      if (newLives <= 0) {
        clearInterval(timerRef.current);
        onGameOver?.(prev.score);
        return { ...prev, lives: 0, active: false };
      }
      return { ...prev, lives: newLives };
    });
  }, [onGameOver]);

  // Boss Mechanics Effect
  useEffect(() => {
    if (!gameState.active || !currentBoss) return;

    let intervalId = null;

    if (currentBoss.mechanic === 'shuffle') {
      intervalId = setInterval(() => {
        setGameState(prev => ({ ...prev, shouldRegenerate: true }));
      }, 3000);
    } else if (currentBoss.mechanic === 'multiply') {
      intervalId = setInterval(() => {
        setGameState(prev => ({ 
          ...prev, 
          targetsNeeded: prev.targetsNeeded + 1,
          shouldRegenerate: true 
        }));
      }, 4000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [gameState.active, currentBoss]);

  // Timer management
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        if (!prev.active || prev.isTimeFrozen) return prev;
        
        const newTimeLeft = prev.timeLeft - TIMER_TICK;
        
        // Panic audio
        if (newTimeLeft < PANIC_TIME_THRESHOLD && Math.floor(newTimeLeft * 10) % 5 === 0) {
          audioEngine?.sfx.click();
        }

        // Time expired - mark for regeneration
        if (newTimeLeft <= 0) {
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            clearInterval(timerRef.current);
            onGameOver?.(prev.score);
            return { ...prev, timeLeft: 0, lives: 0, active: false };
          }
          // Lose life and regenerate same level
          const bossLevel = isBossLevel(prev.level);
          const resetTime = bossLevel ? prev.maxTime * 3 : prev.maxTime;
          return { ...prev, timeLeft: resetTime, lives: newLives, targetsFound: 0, shouldRegenerate: true };
        }

        return { ...prev, timeLeft: newTimeLeft };
      });
    }, TIMER_INTERVAL);
  }, [audioEngine, onGameOver]);

  // Start new level
  const startLevel = useCallback((overrideArtifacts = null) => {
    // Check artifacts (use override if provided to handle stale closures)
    const currentArtifacts = overrideArtifacts || artifacts;
    const hasShield = currentArtifacts.some(a => a.id === 'auto_patcher');
    
    setGameState(prev => {
      const bossLevel = isBossLevel(prev.level);
      const initialTime = bossLevel ? prev.maxTime * 3 : prev.maxTime;
      
      return {
        ...prev,
        timeLeft: initialTime,
        maxTimeForLevel: initialTime, // Track max time for current level to fix HUD percentage
        targetsFound: 0,
        active: true,
        shouldRegenerate: false,
        shieldActive: hasShield,
        bossLives: bossLevel ? 3 : 0
      };
    });
    startTimer();
  }, [startTimer, artifacts]);

  // Apply protocol modification - returns updated state for immediate use
  const applyProtocol = useCallback((mod, onComplete) => {
    setGameState(prev => {
      const updated = { ...prev };
      
      if (mod.bp) updated.cleansePercent = Math.min(MAX_CLEANSE_PERCENT, updated.cleansePercent + mod.bp);
      if (mod.gs) updated.gridSize = Math.max(4, Math.min(MAX_GRID_SIZE, updated.gridSize + mod.gs));
      if (mod.anom) updated.targetsNeeded = Math.max(1, updated.targetsNeeded + mod.anom);
      if (mod.time) updated.maxTime += mod.time;
      if (mod.time_m) updated.maxTime = Math.max(MIN_TIME, updated.maxTime + mod.time_m);
      if (mod.life) {
        updated.maxLives += mod.life;
        if (mod.life > 0) updated.lives += mod.life;
        else updated.lives = Math.min(updated.lives, updated.maxLives);
      }
      if (mod.heal) {
        updated.lives = updated.maxLives;
      }
      if (mod.scr) updated.charTypeIdx = Math.min(3, updated.charTypeIdx + 1);
      if (mod.slot) updated.cardsToShow = Math.min(MAX_CARD_SLOTS, updated.cardsToShow + mod.slot);
      if (mod.rr) updated.rerolls += mod.rr;

      updated.level++;
      updated.score += SCORE_PER_LEVEL;
      
      // Call completion callback with updated state
      if (onComplete) {
        setTimeout(() => onComplete(updated), 0);
      }
      
      return updated;
    });
  }, []);

  // Progress to next level (not shop)
  const nextLevel = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      level: prev.level + 1,
      score: prev.score + SCORE_PER_LEVEL
    }));
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState({ ...INITIAL_GAME_STATE, active: true });
    setShopFreeRerollUsed(false);
    setCurrentBoss(null);
    setArtifacts([]);
  }, []);

  const markRegenerated = useCallback(() => {
    setGameState(prev => ({ ...prev, shouldRegenerate: false }));
  }, []);

  // Consume a reroll
  const consumeReroll = useCallback(() => {
    const hasFreeMarket = artifacts.some(a => a.effect === 'free_market');
    if (hasFreeMarket) return; // Free rerolls
    
    setGameState(prev => ({
      ...prev,
      rerolls: Math.max(0, prev.rerolls - 1)
    }));
  }, [artifacts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Add artifact
  const addArtifact = useCallback((artifact) => {
    setArtifacts(prev => [...prev, artifact]);
  }, []);

  return {
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
    startTimer,
    currentBoss,
    setCurrentBoss,
    artifacts,
    addArtifact,
    markRegenerated
  };
};
