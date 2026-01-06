// Game character sets (removed 'galactic', added 'custom' for TTF font)
export const CHAR_TYPES = ['numbers', 'letters', 'mixed', 'custom'];

export const CHAR_SETS = {
  numbers: "0123456789".split(""),
  letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  mixed: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
  custom: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("") // Letters only, styled with minecraft-enchantment.ttf
};

// Initial game state configuration
export const INITIAL_GAME_STATE = {
  level: 1,
  score: 0,
  lives: 3,
  maxLives: 3,
  timeLeft: 10,
  maxTime: 10,
  gridSize: 4,
  targetsNeeded: 1,
  charTypeIdx: 0,
  cleansePercent: 0,
  rerolls: 2,
  cardsToShow: 3,
  targetsFound: 0,
  timerId: null,
  active: false,
  shouldRegenerate: false,
  bossLives: 0
};

// Scoring constants
export const SCORE_PER_TARGET = 10;
export const SCORE_PER_LEVEL = 50;

// Timer constants
export const TIMER_TICK = 0.05; // seconds
export const TIMER_INTERVAL = 50; // milliseconds
export const PANIC_TIME_THRESHOLD = 3; // seconds

// Grid constraints
export const MIN_GRID_SIZE = 4;
export const MAX_GRID_SIZE = 16;
export const MAX_CLEANSE_PERCENT = 80;
export const MIN_TIME = 4;
export const MAX_CARD_SLOTS = 5;

// Boss levels: 10, 25, 50, 75, 100...
export const isBossLevel = (level) => {
  if (level === 10) return true;
  if (level >= 25 && (level - 25) % 25 === 0) return true; // 25, 50, 75...
  return false;
};
