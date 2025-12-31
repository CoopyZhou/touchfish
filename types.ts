export interface Vector2D {
  x: number;
  y: number;
}

export interface Fish {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  speed: number;
  angle: number;
  tailPhase: number; // For animation
}

export interface Bubble {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export interface Jellyfish {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  tentacleOffset: number;
  color: string;
}

export enum InteractionMode {
  ATTRACT = 'ATTRACT', // Mouse is food
  REPEL = 'REPEL',    // Mouse is predator
  IDLE = 'IDLE'       // No strong effect, just curiosity
}

export interface SimulationConfig {
  fishCount: number;
  jellyfishCount: number;
  interactionMode: InteractionMode;
  showDebug: boolean;
  baseSpeed: number;
  waterColorStart: string;
  waterColorEnd: string;
}
