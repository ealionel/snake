import * as _ from 'lodash'
import { Cell } from './interfaces'
import Snake from './classes/Snake'

/**
 * Creates a random cell between the rectangle formed by the two cells
 * passed in parameters.
 * @param topLeft Top left cell
 * @param bottomLeft Bottom right cell
 */
export function randomCell(max: Cell, min: Cell = { x: 0, y: 0 }): Cell {
  return {
    x: Math.floor(Math.random() * (max.x - min.x)) + min.x,
    y: Math.floor(Math.random() * (max.y - min.y)) + min.y,
  }
}

/**
 * Checks if `cell` is equal to one of the cells in the list
 * @param list
 * @param cell
 */
export function cellCollisionCheck(list: Cell[], cell: Cell) {
  return list.some((otherCell: Cell) => _.isEqual(otherCell, cell))
}

export function snakeCollisionCheck(snake: Snake, snakeTg: Snake) {
  let tail = snake === snakeTg ? snakeTg.tail.slice(1) : snakeTg.tail
  const hasCollided = cellCollisionCheck(tail, snake.getHead())

  if (hasCollided) console.log(`${snake} collided with ${snakeTg}`)

  return hasCollided
}
