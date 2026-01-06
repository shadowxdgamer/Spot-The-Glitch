// Shop modification cards
export const MODS = [
  { id: 'cleanse_1', b: 'Data Filter', c: 'Array Expansion', r: 'Common', bp: 10, gs: 1 },
  { id: 'reroll_1', b: 'Reroll Protocol', c: 'Time Leak', r: 'Common', rr: 2, time_m: -1 },
  { id: 'cleanse_2', b: 'Deep Cleanse', c: 'Anomaly Sprout', r: 'Uncommon', bp: 20, anom: 1 },
  { id: 'type_up', b: 'Signal Scramble', c: 'None', r: 'Uncommon', scr: true },
  { id: 'pack_up', b: 'Expansion Pack', c: 'Array Expansion', r: 'Rare', slot: 1, gs: 1 },
  { id: 'repair_1', b: 'Integrity Repair', c: 'Anomaly Sprout', r: 'Rare', life: 1, anom: 1 },
  { id: 'time_up', b: 'Buffer Node', c: 'None', r: 'Rare', time: 5 },
  { id: 'cleanse_epic', b: 'Void Protocol', c: 'Double Expansion', r: 'Epic', bp: 30, gs: 2 },
  { id: 'target_up', b: 'Multi-Core', c: 'Energy Drain', r: 'Epic', life: 1, anom: 1, time_m: -1 },
  { id: 'focus_mode', b: 'Target Isolation', c: 'Visual Noise', r: 'Epic', anom: -1, gs: 2 },
  { id: 'cleanse_leg', b: 'Ghost Protocol', c: 'Maximum Chaos', r: 'Legendary', bp: 45, anom: 2, gs: 1 },
  { id: 'sys_restore', b: 'System Restore', c: 'Hard Reset', r: 'Legendary', heal: true, life: 1, time_m: -2 },
  { id: 'lucky_glitch', b: 'Lucky Packet', c: 'Stability Leak', r: 'Rare', rr: 5, bp: 10, life: -1 },
  { id: 'zip_bomb', b: 'Grid Compression', c: 'Malware Bloom', r: 'Rare', gs: -1, anom: 2 }
];

// Rarity weights based on level/shop number
export const getRarityWeights = (level) => {
  const shopNum = level / 5;
  
  if (shopNum === 1) {
    return { common: 50, uncommon: 40, rare: 6, epic: 3, legendary: 1 };
  }
  if (shopNum === 2) {
    return { common: 40, uncommon: 50, rare: 6, epic: 3, legendary: 1 };
  }
  if (shopNum === 3) {
    return { common: 35, uncommon: 45, rare: 10, epic: 7, legendary: 3 };
  }
  
  return {
    common: Math.max(20, 35 - (shopNum * 2)),
    uncommon: Math.max(20, 45 - (shopNum * 2)),
    rare: Math.min(25, 10 + (shopNum * 2)),
    epic: Math.min(20, 7 + (shopNum * 2)),
    legendary: Math.min(15, 3 + shopNum)
  };
};

// Pick a random mod based on rarity
export const pickMod = (level, cleansePercent, cardsToShow, gridSize) => {
  const weights = getRarityWeights(level);
  const r = Math.random() * 100;
  let rarity = 'Common';
  
  if (r < weights.legendary) {
    rarity = 'Legendary';
  } else if (r < weights.legendary + weights.epic) {
    rarity = 'Epic';
  } else if (r < weights.legendary + weights.epic + weights.rare) {
    rarity = 'Rare';
  } else if (r < weights.legendary + weights.epic + weights.rare + weights.uncommon) {
    rarity = 'Uncommon';
  }
  
  let filtered = MODS.filter(m => m.r === rarity);
  
  // Filter out cleanse mods if already at max
  if (cleansePercent >= 80) {
    filtered = filtered.filter(m => !m.bp);
  }
  
  // Filter out slot mods if already at max
  if (cardsToShow >= 5) {
    filtered = filtered.filter(m => !m.slot);
  }

  // If filtered is empty, pick any mod
  let choice = filtered.length > 0
    ? filtered[Math.floor(Math.random() * filtered.length)]
    : MODS[Math.floor(Math.random() * MODS.length)];

  // Handle Focus Mode absolute grid limit
  // If grid is too large to expand, change the penalty
  if (choice.id === 'focus_mode' && gridSize >= 15) {
    return {
      ...choice,
      c: 'Time Compression',
      gs: 0,
      time_m: -2
    };
  }

  return choice;
};
    filtered = filtered.filter(m => !m.slot);
  }

  if (filtered.length === 0) {
    return MODS[Math.floor(Math.random() * MODS.length)];
  }
  
  return filtered[Math.floor(Math.random() * filtered.length)];
};
