import Game from './Game'
import World from './World'
import { Direction } from '../interfaces'

export type GameHandler<View> = (game: Game, view: View) => any

export function makeController<View>(game: Game, view: View) {
  return (handler: GameHandler<View>) => {
    handler(game, view)
  }
}

export const arrowController = (game: Game, world: World) => {
  world.canvas.addEventListener('keydown', e => {
    const dir = game.player.direction
    switch (e.key) {
      case 'ArrowLeft':
        if (dir !== Direction.RIGHT) game.moveBuffer = Direction.LEFT
        break
      case 'ArrowRight':
        if (dir !== Direction.LEFT) game.moveBuffer = Direction.RIGHT
        break
      case 'ArrowUp':
        if (dir !== Direction.DOWN) game.moveBuffer = Direction.UP
        break
      case 'ArrowDown':
        if (dir !== Direction.UP) game.moveBuffer = Direction.DOWN
        break
    }
  })
}

export const zqsdController = (game: Game, world: World) => {
  world.canvas.addEventListener('keydown', e => {
    const dir = game.player.direction
    switch (e.key) {
      case 'q':
        if (dir !== Direction.RIGHT) game.moveBuffer = Direction.LEFT
        break
      case 'd':
        if (dir !== Direction.LEFT) game.moveBuffer = Direction.RIGHT
        break
      case 'z':
        if (dir !== Direction.DOWN) game.moveBuffer = Direction.UP
        break
      case 's':
        if (dir !== Direction.UP) game.moveBuffer = Direction.DOWN
        break
    }
  })
}
