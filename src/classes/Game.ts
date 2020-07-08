import { cellCollisionCheck, randomCell, snakeCollisionCheck } from '../helpers'
import { Cell, GameRules, EventHandler, GameEvent } from './../interfaces'
import Snake from './Snake'

interface GameOperations {
  pause(): void
  run(): void
  togglePause(): void
}

namespace GameState {
  export abstract class State implements GameOperations {
    protected game: Game
    public stateName: string

    constructor(game: Game) {
      this.game = game
    }

    toString(): string {
      return this.stateName
    }

    defaultHandler(operation: string) {
      console.log(
        `ERROR : Tried to ${operation} while in state : ${this.toString()}`,
      )
    }

    run() {
      this.defaultHandler('run game')
    }

    pause() {
      this.defaultHandler('pause game')
    }

    togglePause() {
      this.defaultHandler('toggle pause')
    }
  }

  export class Running extends State {
    stateName = 'RUNNING'

    pause(): void {
      this.game.emit(GameEvent.PAUSE)

      clearInterval(this.game.intervalId)

      this.game.setState(new GameState.Running(this.game))
    }

    togglePause(): void {
      this.pause()
    }
  }

  export class Pause extends State {
    stateName = 'PAUSE'

    run(): void {
      this.game.emit(GameEvent.RUN)
      this.game.intervalId = setInterval(
        this.game.loop,
        this.game.rules.tickRate,
      )

      this.game.setState(new GameState.Pause(this.game))
    }

    togglePause(): void {
      this.run()
    }
  }
}

export default class Game {
  timer: number = 0 // Number of ticks
  rules: GameRules
  snakes: Snake[] = []
  foods: Cell[] = []

  subscribers: Array<{
    handler: EventHandler
    event: GameEvent
  }> = []

  private state: GameState.State
  intervalId: any

  constructor(rules: GameRules) {
    this.rules = rules
    this.state = new GameState.Pause(this)

    this.generateFood()
  }

  setState(state: GameState.State) {
    this.state = state
  }

  run(): void {
    this.state.run()
  }

  pause(): void {
    this.state.pause()
  }

  togglePause(): void {
    this.togglePause()
  }

  loop = () => {
    this.emit(GameEvent.NEW_TICK) // To render views

    this.snakes.forEach((snake) => {
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
        this.snakes.some((s) => snakeCollisionCheck(snake, s))
      ) {
        this.removeSnake(snake)
        console.log('Game over !')
      }
    })

    this.timer += 1
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
      this.snakes.some((snake) => cellCollisionCheck(snake.tail, cell))
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

  addSnake(snake: Snake): void {
    this.snakes.push(snake)
  }

  removeSnake(rmSnake: Snake): void {
    this.snakes = this.snakes.filter((snake) => snake !== rmSnake)
  }

  subscribe(event: GameEvent, observer: EventHandler): void {
    this.subscribers.push({
      event,
      handler: observer,
    })
  }

  unsubscribe(rmObs: EventHandler): void {
    this.subscribers = this.subscribers.filter((subs) => subs.handler !== rmObs)
  }

  emit(event: GameEvent, data?: any): void {
    this.subscribers.forEach((sub) => {
      if (sub.event === event) {
        sub.handler(data)
      }
    })
  }
}
