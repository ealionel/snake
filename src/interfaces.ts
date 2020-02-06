export interface GameRules {
  tickRate: number // in ms
  defaultLength: number
  rows: number
  columns: number
  snakesCollision?: boolean
}

export interface WorldProperties {
  cellSpace: number
}

export interface Cell {
  x: number
  y: number
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum GameState {
  RUNNING,
  PAUSED,
}

export type EventHandler = (data: any) => void

export interface KeyboardMapControl {
  up: string
  down: string
  left: string
  right: string
  pause?: string
}

export enum GameEvent {
  NEW_TICK = 'NEW_TICK',
  PAUSE = 'PAUSE',
  RUN = 'RUN',
}
