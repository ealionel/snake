import { cellCollisionCheck, randomCell, snakeCollisionCheck } from '../helpers'
import { Cell, GameRules, Observer, GameState } from './../interfaces'
import Snake from './Snake'

export default class Game {
  timer: number = 0 // Number of ticks
  rules: GameRules
  snakes: Snake[] = []
  foods: Cell[] = []
  observers: Observer[] = []

  state: GameState = GameState.PAUSED
  intervalId: any

  constructor(rules: GameRules) {
    this.rules = rules
    this.generateFood()
  }

  run() {
    if (this.state === GameState.RUNNING) {
      return
    }

    this.state = GameState.RUNNING
    console.log('Game running.')
    this.intervalId = setInterval(this.loop, this.rules.tickRate)
  }

  loop = () => {
    this.notifyObservers() // To render views

    this.snakes.forEach(snake => {
      snake.direction = snake.moveBuffer

      const newCell = snake.nextCell()

      // Eat food
      if (cellCollisionCheck(this.foods, newCell)) {
        snake.grow()
        this.foods.pop()
        this.generateFood()
      } else {
        snake.move()
      }

      // End game
      if (
        this.isOutsideBorder(newCell) ||
        this.snakes.some(s => snakeCollisionCheck(snake, s))
      ) {
        this.removeSnake(snake)
        console.log('Game over !')
      }
    })

    this.timer += 1
  }

  pause() {
    if (this.state === GameState.RUNNING) {
      clearInterval(this.intervalId)
      this.state = GameState.PAUSED
      console.log('Game paused.')
    }
  }

  togglePause() {
    switch (this.state) {
      case GameState.PAUSED:
        this.run()
        break
      case GameState.RUNNING:
        this.pause()
        break
    }

    return this.state
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
      cellCollisionCheck(this.foods, cell)
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
