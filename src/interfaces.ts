export interface GameRules {
  tickRate: number // in ms
  defaultLength: number
}

export interface WorldProperties {
  spaceInterval: number
  rows: number
  columns: number
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
