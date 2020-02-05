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
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export enum GameState {
  RUNNING,
  PAUSED,
}

export type Observer = (data: any) => any

export interface KeyboardMapControl {
  up: string
  down: string
  left: string
  right: string
  pause?: string
}
