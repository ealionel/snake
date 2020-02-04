import * as _  from 'lodash';
import { Cell } from './interfaces';

/**
 * Creates a random cell between the rectangle formed by the two cells
 * passed in parameters.
 * @param topLeft Top left cell
 * @param bottomLeft Bottom right cell
 */
export function randomCell(max: Cell, min: Cell = {x:0, y:0}): Cell {
    return {
        x: Math.floor(Math.random() * (max.x - min.x)) + min.x,
        y: Math.floor(Math.random() * (max.y - min.y)) + min.y,
    }
}

export function collisionCheck(list: Cell[], cell: Cell) {
    return list.some((otherCell: Cell) => _.isEqual(otherCell, cell))
}