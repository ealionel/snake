import { cellCollisionCheck, randomCell, snakeCollisionCheck } from '../helpers'
import {
  Cell,
  GameRules,
  EventHandler,
  GameState,
  GameEvent,
} from './../interfaces'
import Snake from './Snake'

export default class Game {
  timer: number = 0 // Number of ticks
  rules: GameRules
  snakes: Snake[] = []
  foods: Cell[] = []

  subscribers: Array<{
    handler: EventHandler
    event: GameEvent
  }> = []

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
    this.emit(GameEvent.RUN)

    this.state = GameState.RUNNING
    console.log('Game running.')
    this.intervalId = setInterval(this.loop, this.rules.tickRate)
  }

  loop = () => {
    this.emit(GameEvent.NEW_TICK) // To render views

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
      this.emit(GameEvent.PAUSE)

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

  getRandomEmptyCell(): Cell {
    const randCell = () => randomCell(this.getLastCell())
    let cell: Cell = randCell()
    while (
      cellCollisionCheck(this.foods, cell) ||
      this.snakes.some(snake => cellCollisionCheck(snake.tail, cell))
    ) {
      cell = randCell()
    }

    return cell
  }

  generateFood(): Cell {
    const randCell = this.getRandomEmptyCell()
    this.foods.push(randCell)

    return randCell
  }

  addSnake(snake: Snake) {
    this.snakes.push(snake)
  }

  removeSnake(rmSnake: Snake) {
    this.snakes = this.snakes.filter(snake => snake !== rmSnake)
  }

  subscribe(event: GameEvent, observer: EventHandler) {
    this.subscribers.push({
      event,
      handler: observer,
    })
  }

  unsubscribe(rmObs: EventHandler) {
    this.subscribers = this.subscribers.filter(subs => subs.handler !== rmObs)
  }

  emit(event: GameEvent, data?: any) {
    this.subscribers.forEach(sub => {
      if (sub.event === event) {
        sub.handler(data)
      }
    })
  }
}
