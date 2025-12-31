import { InteractionMode, SimulationConfig } from "./types";

export const DEFAULT_CONFIG: SimulationConfig = {
  fishCount: 80,
  jellyfishCount: 5,
  interactionMode: InteractionMode.ATTRACT,
  showDebug: false,
  baseSpeed: 2,
  waterColorStart: '#001e3c', // Deep dark blue
  waterColorEnd: '#006064',   // Cyan/Teal mix
};

export const FISH_COLORS = [
  '#fca5a5', // red-300
  '#fcd34d', // amber-300
  '#86efac', // green-300
  '#67e8f9', // cyan-300
  '#c4b5fd', // violet-300
  '#fda4af', // rose-300
];

export const JELLYFISH_COLORS = [
  'rgba(255, 180, 255, 0.4)',
  'rgba(180, 220, 255, 0.4)',
  'rgba(200, 255, 220, 0.4)',
];

// Physics Constants
export const VISUAL_RANGE = 80;
export const PROTECTED_RANGE = 20;
export const MATCHING_FACTOR = 0.05;
export const CENTERING_FACTOR = 0.0005;
export const AVOID_FACTOR = 0.05;
export const TURN_FACTOR = 0.2;
export const MOUSE_INFLUENCE_RANGE = 250;
export const MOUSE_ATTRACT_FACTOR = 0.002;
export const MOUSE_REPEL_FACTOR = 0.05;
