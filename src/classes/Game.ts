import { GameRules, Cell, Direction } from './../interfaces'
import World from './World'
import Snake from './Snake'
import { randomCell, collisionCheck } from '../helpers'
import * as _ from 'lodash'

export default class Game {
  timer: number = 0 // Number of ticks
  world: World
  rules: GameRules
  player: Snake

  foods: Cell[]

  constructor(world: World, rules: GameRules) {
    this.world = world
    this.rules = rules

    this.world.canvas.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowLeft':
          this.player.direction = Direction.LEFT
          break
        case 'ArrowRight':
          this.player.direction = Direction.RIGHT
          break
        case 'ArrowUp':
          this.player.direction = Direction.UP
          break
        case 'ArrowDown':
          this.player.direction = Direction.DOWN
          break
      }
    })
  }

  start(initialCell: Cell) {
    console.log('Game Started...')
    this.player = new Snake(initialCell)
    const createRandomCell = () => randomCell(this.world.getLastCell())
    this.foods = [createRandomCell()]

    const endCallback = () => {
      console.log('Game over !')
    }

    const intervalId = setInterval(() => {
      this.player.addHead(this.player.nextCell())
      const head: Cell = this.player.getHead()

      if (
        this.borderCheck(head) ||
        collisionCheck(this.player.tail.slice(1), head)
      ) {
        clearInterval(intervalId)
        console.log(this.borderCheck(head), this.player.tail)
        endCallback()
      }

      if (collisionCheck(this.foods, head)) {
        this.foods.pop()
        this.generateFood()
      } else {
        this.player.removeLast()
      }

      this.world.clear()
      this.renderFood()
      this.renderSnake()

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
      cell.x > this.world.properties.rows ||
      cell.y > this.world.properties.columns
    )
  }

  generateFood() {
    const randCell = () => randomCell(this.world.getLastCell())
    let cell: Cell = randCell()
    while (
      collisionCheck(this.foods, cell) ||
      collisionCheck(this.player.tail, cell)
    ) {
      cell = randCell()
    }

    this.foods.push(cell)
  }

  renderSnake() {
    this.world.drawCells(this.player.tail)
  }

  renderFood() {
    this.world.drawCells(this.foods, 'blue')
  }
}
