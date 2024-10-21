import { Board } from '@/game/Board.ts'
import { Ship } from '@/game/Ship.ts'
import { scene } from '@/game/Scene.ts'
import { camera } from '@/game/Camera.ts'
import { ShipShapes } from '@/constants/ShipShapes.ts'

class Game {
    private board: Board
    private settingUp = false

    constructor() {
        const shipShapes = [ShipShapes.LONG, ShipShapes.MEDIUM, ShipShapes.SHORT, ShipShapes.SHORT, ShipShapes.SMALL]
        const ships = shipShapes.map(shipShape => new Ship(shipShape))
        const board = new Board(ships)
        scene.addElements(board.toThreeObjects())
        this.board = board
    }

    setupGame() {
        this.settingUp = true
        camera.moveTo({ x: 0, y: 10, z: 0 })
        scene.addElementsToTrack(this.board.getShipElements() ?? [])
        this.board.startEditing()
    }

    finishSetupGame() {
        this.settingUp = false
        camera.moveToInitialPosition()
        scene.clearElementsToTrack()
        this.board.endEditing()
    }

}

export const game = new Game()
