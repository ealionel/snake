import { Direction, Cell } from './../interfaces'
export default class Snake {
  direction: Direction
  length: number
  tail: Cell[]

  constructor(cell?: Cell, length: number = 1) {
    this.direction = Direction.RIGHT
    this.length = 1

    this.tail = [cell] || [{ x: 0, y: 0 }]
  }

  addHead(part: Cell) {
    this.tail.unshift(part)
  }

  removeLast() {
    this.tail.pop()
  }

  getHead(): Cell {
    return this.tail[0]
  }

  nextCell() {
    const cell = { ...this.getHead() }
    switch (this.direction) {
      case Direction.LEFT:
        cell.x -= 1
        break
      case Direction.RIGHT:
        cell.x += 1
        break
      case Direction.UP:
        cell.y -= 1
        break
      case Direction.DOWN:
        cell.y += 1
        break
    }

    return cell
  }
}
