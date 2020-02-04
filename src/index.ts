import { GameRules, WorldProperties } from './interfaces'
import World from './classes/World'
import Game from './classes/Game'
import { arrowController, zqsdController } from './classes/Controller'

const rules: GameRules = {
  tickRate: 70,
  defaultLength: 1,
  columns: 15,
  rows: 15,
}

const worldOptions: WorldProperties = {
  cellSpace: 30,
}

const game = new Game(rules)
const world = new World(game, [arrowController, zqsdController], worldOptions)

game.start()

document.body.appendChild(world.canvas)
// document.body.appendChild(world2.canvas)
document.body.style.textAlign = 'center'
