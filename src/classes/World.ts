import { Cell } from './../interfaces'
import { GameRules, WorldProperties } from '../interfaces'
import Game from './Game'

export default class World {
  canvas: HTMLCanvasElement
  properties: WorldProperties
  game: Game

  constructor(game: Game, properties: WorldProperties) {
    this.canvas = document.createElement('canvas')
    this.game = game

    this.canvas.width = properties.cellSpace * game.rules.columns + 1
    this.canvas.height = properties.cellSpace * game.rules.rows + 1

    this.canvas.classList.add('gameCanvas')

    game.addObserver(this.onUpdate)

    this.properties = properties

    this.canvas.tabIndex = 0

    this.drawGrid()
  }

  onUpdate = () => {
    this.clear()
    this.game.snakes.forEach(snake => {
      this.drawCells(snake.tail)
    })
    this.drawFoods(this.game.foods, '#ff8352')
  }

  drawGrid(color: string = 'lightgray') {
    const width = this.canvas.width
    const height = this.canvas.height

    const context = this.canvas.getContext('2d')

    context.strokeStyle = 'lightgray'

    context.beginPath()
    for (let x = 0; x <= this.game.rules.columns; x++) {
      let pos = x * this.properties.cellSpace + 0.5
      context.moveTo(pos, 0)
      context.lineTo(pos, height)
    }
    for (let y = 0; y <= this.game.rules.rows; y++) {
      let pos = y * this.properties.cellSpace + 0.5
      context.moveTo(0, pos)
      context.lineTo(width, pos)
    }
    context.stroke()
  }

  drawCell = (cell: Cell, color: string = 'black'): boolean => {
    if (
      cell.x > this.game.rules.columns - 1 ||
      cell.y > this.game.rules.rows - 1
    ) {
      // console.warn(`Tried to draw non existing cell: (${x}, ${y})`)
      return false
    }

    if (cell.x == null || cell.y == null) {
      return
    }

    const context = this.canvas.getContext('2d')
    const space = this.properties.cellSpace
    context.fillStyle = color
    context.fillRect(cell.x * space, cell.y * space, space, space)

    return true
  }

  drawFood = (cell: Cell, color: string = 'black'): boolean => {
    const context = this.canvas.getContext('2d')
    const space = this.properties.cellSpace

    const [px, py] = this.cellToPixel(cell)
    context.fillStyle = color
    context.beginPath()
    context.arc(px + space / 2, py + space / 2, space * 0.375, 0, 2 * Math.PI)
    context.fill()
    context.closePath()

    return true
  }

  /**
   * Higher order function used to draw based on an array of cells
   */
  makeMultiDrawer(drawer: (cell: Cell, color: string) => boolean) {
    return (cells: Cell[], color: string = 'black'): boolean[] => {
      return cells.map(cell => drawer(cell, color))
    }
  }

  drawCells = this.makeMultiDrawer(this.drawCell)
  drawFoods = this.makeMultiDrawer(this.drawFood)

  clear() {
    this.canvas
      .getContext('2d')
      .clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawGrid()
  }

  /**
   * Converts cell to pixel position in the canvas
   * @param cell Desired cell
   */
  cellToPixel(cell: Cell): number[] {
    return [
      cell.x * this.properties.cellSpace,
      cell.y * this.properties.cellSpace,
    ]
  }
}
