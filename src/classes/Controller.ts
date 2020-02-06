import { KeyboardMapControl, GameEvent } from './../interfaces'
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
    world.canvas.addEventListener('keydown', e => {
      e.preventDefault()

      const dir = snake.direction
      switch (e.key) {
        case keysControl.left:
          snake.controlLeft()
          break
        case keysControl.right:
          snake.controlRight()
          break
        case keysControl.up:
          snake.controlUp()
          break
        case keysControl.down:
          snake.controlDown()
          break
        case keysControl.pause:
          game.togglePause()
          break
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
