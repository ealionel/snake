import { GameRules, Cell, Direction, Observer } from './../interfaces'
import World from './World'
import Snake from './Snake'
import { randomCell, collisionCheck } from '../helpers'
import * as _ from 'lodash'

export default class Game {
  timer: number = 0 // Number of ticks
  rules: GameRules
  player: Snake

  foods: Cell[]

  observers: Observer[] = []

  // Direction snake should head to on next frame
  moveBuffer: Direction

  constructor(rules: GameRules) {
    this.rules = rules
    this.player = new Snake({ x: 0, y: 0 })

    this.player.direction = Direction.RIGHT
    this.moveBuffer = Direction.RIGHT
  }

  start() {
    console.log('Game Started...')
    const createRandomCell = () => randomCell(this.getLastCell())
    this.foods = [createRandomCell()]

    const endCallback = () => {
      console.log('Game over !')
    }

    const intervalId = setInterval(() => {
      this.notifyObservers()

      this.player.direction = this.moveBuffer
      this.player.addHead(this.player.nextCell())
      const head: Cell = this.player.getHead()

      if (
        this.borderCheck(head) ||
        collisionCheck(this.player.tail.slice(1), head)
      ) {
        clearInterval(intervalId)
        endCallback()
      }

      if (collisionCheck(this.foods, head)) {
        this.foods.pop()
        this.generateFood()
      } else {
        this.player.removeLast()
      }

      this.timer += 1
    }, this.rules.tickRate)
  }

  /**
   * Checks if cell is inside border or not
   * @param cell Cell to check
   */
  borderCheck(cell: Cell) {
    return (
      cell.x < 0 ||
      cell.y < 0 ||
      cell.x > this.rules.rows - 1 ||
      cell.y > this.rules.columns - 1
    )
  }

  getLastCell(): Cell {
    return {
      x: this.rules.columns - 1,
      y: this.rules.rows - 1,
    }
  }

  generateFood() {
    const randCell = () => randomCell(this.getLastCell())
    let cell: Cell = randCell()
    while (
      collisionCheck(this.foods, cell) ||
      collisionCheck(this.player.tail, cell)
    ) {
      cell = randCell()
    }

    this.foods.push(cell)
  }

  addObserver(observer: Observer) {
    this.observers.push(observer)
  }

  removeObserver(rmObs: Observer) {
    this.observers = this.observers.filter(obs => obs !== rmObs)
  }

  notifyObservers() {
    this.observers.forEach(observer => {
      observer(this)
    })
  }
}
