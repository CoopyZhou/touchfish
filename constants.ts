import { InteractionMode, SimulationConfig } from "./types";

export const DEFAULT_CONFIG: SimulationConfig = {
  fishCount: 80,
  jellyfishCount: 6,
  interactionMode: InteractionMode.ATTRACT,
  showDebug: false,
  baseSpeed: 2,
  waterColorStart: '#0f172a', // Deep Ocean Blue
  waterColorEnd: '#0ea5e9',   // Sky Blue
};

export const FISH_COLORS = [
  '#fca5a5', // red-300 (Soft Red)
  '#fcd34d', // amber-300 (Soft Yellow)
  '#86efac', // green-300 (Mint)
  '#67e8f9', // cyan-300 (Cyan)
  '#c4b5fd', // violet-300 (Lavender)
  '#fda4af', // rose-300 (Pink)
  '#f9a8d4', // pink-300 (Light Pink)
  '#fff1f2', // rose-50 (Near White/Pale Pink)
  '#e0f2fe', // sky-100 (Pale Blue)
];

export const JELLYFISH_COLORS = [
  'rgba(255, 200, 255, 0.45)', // Pinker
  'rgba(200, 240, 255, 0.45)', // Bluer
  'rgba(255, 250, 240, 0.45)', // Creamier
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
