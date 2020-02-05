import { GameRules, WorldProperties } from './interfaces'
import World from './classes/World'
import Game from './classes/Game'
import { createKeyboardController } from './classes/Controller'
import Snake from './classes/Snake'
import { randomCell } from './helpers'

const rules: GameRules = {
  tickRate: 100,
  defaultLength: 1,
  columns: 15,
  rows: 15,
}

const worldOptions: WorldProperties = {
  cellSpace: 30,
}

const game = new Game(rules)
const world = new World(game, worldOptions)
const world2 = new World(game, { cellSpace: 20 })
const controller = createKeyboardController(game, world)

const snake1 = new Snake({ x: 0, y: 0 })
const snake2 = new Snake({ x: 0, y: 10 })

controller(snake1)
controller(snake2, {
  up: 'z',
  down: 's',
  left: 'q',
  right: 'd',
})

game.addSnake(snake1)
game.addSnake(snake2)

game.run()

document.body.appendChild(world.canvas)
world.canvas.focus()

const addSnakeButton = document.createElement('button')
addSnakeButton.innerHTML = 'Add Shhnekkk'
addSnakeButton.addEventListener('click', e => {
  const newSnake = new Snake(randomCell(game.getLastCell()))
  controller(newSnake)
  game.addSnake(newSnake)
})

document.body.appendChild(addSnakeButton)

document.body.style.textAlign = 'center'
