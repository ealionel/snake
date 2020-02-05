import { collisionCheck, randomCell } from '../helpers'
import { Cell, Direction, GameRules, Observer } from './../interfaces'
import Snake from './Snake'

export default class Game {
  timer: number = 0 // Number of ticks
  rules: GameRules
  snakes: Snake[] = []

  foods: Cell[] = []

  observers: Observer[] = []

  constructor(rules: GameRules) {
    this.rules = rules
  }

  start() {
    console.log('Game Started...')
    this.generateFood()

    const endCallback = () => {
      console.log('Game over !')
    }

    const intervalId = setInterval(() => {
      this.notifyObservers() // To render views

      this.snakes.forEach(snake => {
        snake.direction = snake.moveBuffer

        const newCell = snake.nextCell()

        // Eat food
        if (collisionCheck(this.foods, newCell)) {
          snake.grow()
          this.foods.pop()
          this.generateFood()
        } else {
          snake.move()
        }

        if (
          this.isOutsideBorder(newCell) ||
          collisionCheck(snake.tail.slice(1), newCell)
        ) {
          this.removeSnake(snake)
          endCallback()
        }
      })

      this.timer += 1
    }, this.rules.tickRate)
  }

  /**
   * Checks if cell is inside border or not
   * @param cell Cell to check
   */
  isOutsideBorder(cell: Cell) {
    return (
      cell.x < 0 ||
      cell.y < 0 ||
      cell.y > this.rules.rows - 1 ||
      cell.x > this.rules.columns - 1
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
      collisionCheck(this.foods, cell)
      // || collisionCheck(this.snake.tail, cell)
    ) {
      cell = randCell()
    }

    this.foods.push(cell)
  }

  addSnake(snake: Snake) {
    this.snakes.push(snake)
  }

  removeSnake(rmSnake: Snake) {
    this.snakes = this.snakes.filter(snake => snake !== rmSnake)
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
