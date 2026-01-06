export const BOSSES = {
  THE_VOID: {
    id: 'the_void',
    name: 'The Void',
    description: 'Visual sensors compromised. Data only visible via localized scan.',
    mechanic: 'fog_of_war', // Mobile: Touch & Hold to scan, Tap to select. Desktop: Hover scan.
    icon: '👁️'
  },
  THE_SHIFTER: {
    id: 'the_shifter',
    name: 'The Shifter',
    description: 'Grid structural integrity failing. Matrix reconfigures periodically.',
    mechanic: 'shuffle',
    interval: 3000, // Shuffle every 3s
    icon: '🔄'
  },
  THE_VIRUS: {
    id: 'the_virus',
    name: 'The Virus',
    description: 'Self-replicating anomaly detected. Containment required explicitly.',
    mechanic: 'multiply',
    interval: 4000, // Add new target every 4s
    icon: '🦠'
  },
  THE_BLINKER: {
    id: 'the_blinker',
    name: 'The Blinker',
    description: 'Power supply unstable. Visual feed intermittent.',
    mechanic: 'strobe',
    onDuration: 800,
    offDuration: 400,
    icon: '⚡'
  }
};

export const ARTIFACTS = [
  {
    id: 'quantum_lens',
    name: 'Quantum Lens',
    description: 'Reveals the general sector of anomalies for the first 2 seconds.',
    rarity: 'Legendary',
    effect: 'sector_scan'
  },
  {
    id: 'chrono_battery',
    name: 'Chrono Battery',
    description: 'Freezes time for 3s after finding a target.',
    rarity: 'Epic',
    effect: 'time_freeze'
  },
  {
    id: 'auto_patcher',
    name: 'Auto Patcher',
    description: 'Prevents damage from the first mistake of every level.',
    rarity: 'Rare',
    effect: 'shield'
  },
  {
    id: 'golden_glitch',
    name: 'Golden Glitch',
    description: 'Restores 1 life for every 10 anomalies found.',
    rarity: 'Epic',
    effect: 'life_leech'
  },
  {
    id: 'neural_link',
    name: 'Neural Link',
    description: 'Reduces Shop Reroll cost to 0 permanently.',
    rarity: 'Legendary',
    effect: 'free_market'
  }
];
