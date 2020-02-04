import { Cell } from './../interfaces'
import { GameRules, WorldProperties } from '../interfaces'

export default class World {
  canvas: HTMLCanvasElement
  properties: WorldProperties
  controller: (event: Event) => void

  constructor(properties: WorldProperties) {
    this.canvas = document.createElement('canvas')

    this.canvas.width = properties.spaceInterval * properties.columns + 1
    this.canvas.height = properties.spaceInterval * properties.rows + 1

    this.canvas.classList.add('gameCanvas')

    this.properties = properties

    this.canvas.tabIndex = 0

    this.drawGrid()
  }

  drawGrid(color: string = 'lightgray') {
    const width = this.canvas.width
    const height = this.canvas.height

    const context = this.canvas.getContext('2d')

    context.strokeStyle = 'lightgray'

    context.beginPath()
    for (let x = 0; x <= this.properties.columns; x++) {
      let pos = x * this.properties.spaceInterval + 0.5
      context.moveTo(pos, 0)
      context.lineTo(pos, height)
    }
    for (let y = 0; y <= this.properties.rows; y++) {
      let pos = y * this.properties.spaceInterval + 0.5
      context.moveTo(0, pos)
      context.lineTo(width, pos)
    }
    context.stroke()
  }

  drawCell = ({ x, y }: Cell, color: string = 'black'): boolean => {
    if (x > this.properties.columns || y > this.properties.rows) {
      // console.warn(`Tried to draw non existing cell: (${x}, ${y})`)
      return false
    }

    if (x == null || y == null) {
      return
    }

    const context = this.canvas.getContext('2d')
    const space = this.properties.spaceInterval
    context.fillStyle = color
    context.fillRect(x * space, y * space, space, space)

    return true
  }

  drawFood = (cell: Cell, color: string = 'black'): boolean => {
    const context = this.canvas.getContext('2d')
    const space = this.properties.spaceInterval

    const [px, py] = this.cellToPixel(cell)
    context.fillStyle = color
    context.beginPath()
    context.arc(px + space / 2, py + space / 2, space * 0.8, 0, 2 * Math.PI)
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
      cell.x * this.properties.spaceInterval,
      cell.y * this.properties.spaceInterval,
    ]
  }

  getLastCell(): Cell {
    return {
      x: this.properties.columns - 1,
      y: this.properties.rows - 1,
    }
  }
}
