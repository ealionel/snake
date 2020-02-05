import { KeyboardMapControl } from './../interfaces'
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
      }
    })
  }
}
