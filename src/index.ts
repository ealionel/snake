import { GameRules, WorldProperties } from './interfaces'
import World from './classes/World'
import Game from './classes/Game'

const rules: GameRules = {
  tickRate: 90,
  defaultLength: 1,
}

const worldOptions: WorldProperties = {
  spaceInterval: 30,
  columns: 15,
  rows: 15,
}

const world = new World(worldOptions)
const game = new Game(world, rules)

game.start({
  x: 0,
  y: 0,
})

document.body.appendChild(world.canvas)
// document.body.appendChild(world2.canvas)
document.body.style.textAlign = 'center'
