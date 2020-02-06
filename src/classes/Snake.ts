import { Direction, Cell } from './../interfaces'
export default class Snake {
  direction: Direction
  moveBuffer: Direction
  length: number
  tail: Cell[]

  id: number

  static nbInstances = 0

  constructor(cell?: Cell, length: number = 1) {
    Snake.nbInstances += 1
    this.id = Snake.nbInstances
    this.direction = Direction.RIGHT
    this.moveBuffer = Direction.RIGHT
    this.length = length

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

  move() {
    this.addHead(this.nextCell())
    this.removeLast()
  }

  grow() {
    this.addHead(this.nextCell())
  }

  control(direction: Direction) {
    switch (direction) {
      case Direction.UP:
        this.controlUp()
        break
      case Direction.DOWN:
        this.controlDown()
        break
      case Direction.LEFT:
        this.controlLeft()
        break
      case Direction.RIGHT:
        this.controlRight()
        break
    }
  }

  controlUp() {
    if (this.direction !== Direction.DOWN) this.moveBuffer = Direction.UP
  }
  controlDown() {
    if (this.direction !== Direction.UP) this.moveBuffer = Direction.DOWN
  }
  controlLeft() {
    if (this.direction !== Direction.RIGHT) this.moveBuffer = Direction.LEFT
  }
  controlRight() {
    if (this.direction !== Direction.LEFT) this.moveBuffer = Direction.RIGHT
  }

  toString() {
    return `Snake #${this.id}`
  }
}
