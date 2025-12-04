/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Vector2 {
  x: number;
  y: number;
}

export interface Ball {
  id: string;
  pos: Vector2;
  vel: Vector2;
  radius: number;
  color: string;
  group?: 'inner' | 'outer'; // Track which chamber the ball belongs to
}

export interface SstParams {
  coreRadius: number; 
  coupling: number;   
  maxSpeed?: number;  
}

export interface SwarmParams {
  innerRadius: number; // 0.1 to 0.9 (relative to container)
  innerRotationSpeed: number;
  innerBallCount: number;
}

export interface FluidVortexParams {
  vortexRadius: number; // 0.1 to 0.9 (relative to container)
  vortexStrength: number;
  innerBallCount: number; // Particles spawned specifically in the vortex
}

export interface SimulationConfig {
  id: number;
  name: string;
  shapeType: 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'octagon' | 'star' | 'circle';
  vertexCount: number;
  gravity: number; 
  friction: number; 
  restitution: number; 
  rotationSpeed: number; 
  ballCount: number;
  ballSize: number;
  initialSpeed: number;
  nuanceDescription: string;
  physicsModel?: 'standard' | 'sst-hydrogen' | 'dual-ring-swarm' | 'fluid-vortex'; 
  sstParams?: SstParams;
  swarmParams?: SwarmParams;
  fluidVortexParams?: FluidVortexParams;
  useCanvasBounds?: boolean;
}

export interface GlobalSettings {
  timeScale: number;
  gravityMultiplier: number;
  rotationMultiplier: number;
  bouncinessMultiplier: number;
}