import { KeyboardMapControl, GameEvent } from '../interfaces'
import Game from './Game'
import World from './World'
import { Direction } from '../interfaces'
import Snake from './Snake'

export function createKeyboardController(game: Game, world: World) {
  return (
    snake: Snake,
    keysControl: KeyboardMapControl = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      pause: 'p',
    },
  ) => {
    const keymap: Map<string, () => void> = new Map()

    keymap.set(keysControl.left, snake.controlLeft)
    keymap.set(keysControl.right, snake.controlRight)
    keymap.set(keysControl.up, snake.controlUp)
    keymap.set(keysControl.down, snake.controlDown)
    keymap.set(keysControl.pause, game.togglePause)

    world.canvas.addEventListener('keydown', (e) => {
      e.preventDefault()

      if (keymap.has(e.key)) {
        const handler = keymap.get(e.key)
        handler()
      }
    })
  }
}

export function createAutoController(game: Game) {
  return (snake: Snake, moves: Direction[], loop: boolean = true) => {
    let moveNb = 0

    game.subscribe(GameEvent.NEW_TICK, () => {
      if (moveNb < moves.length) {
        console.log(moveNb)
        snake.control(moves[moveNb])
        moveNb += 1

        if (loop) {
          moveNb = moveNb % moves.length
        }
      }
    })
  }
}

export function createWebsocketController(game: Game, world: World) {
  return (
    snake: Snake,
    keysControl: KeyboardMapControl = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      pause: 'p',
    },
  ) => {
    const keymap: Map<string, () => void> = new Map()

    keymap.set(keysControl.left, snake.controlLeft)
    keymap.set(keysControl.right, snake.controlRight)
    keymap.set(keysControl.up, snake.controlUp)
    keymap.set(keysControl.down, snake.controlDown)
    keymap.set(keysControl.pause, game.togglePause)

    world.canvas.addEventListener('keydown', (e) => {
      e.preventDefault()

      if (keymap.has(e.key)) {
        const handler = keymap.get(e.key)
        handler()
      }
    })
  }
}
