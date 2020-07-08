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
  DEAD_SNAKE = 'DEAD_SNAKE',
  GAME_OVER = 'GAME_OVER',
  NEW_GAME = 'NEW_GAME',
  NEW_FRAME = 'NEW_FRAME',
}
