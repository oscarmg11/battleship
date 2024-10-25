import { Board } from '@/game/Board.ts'
import { Ship } from '@/game/Ship.ts'
import { scene } from '@/game/utils/Scene.ts'
import { camera } from '@/game/utils/Camera.ts'
import { ShipShapes } from '@/constants/ShipShapes.ts'

class Game {
    private board: Board
    private settingUp = false

    constructor() {
        const board = new Board()
        scene.addElements(board.toThreeObjects())
        this.board = board
    }

    setupGame() {
        this.settingUp = true
        camera.moveTo({ x: 0, y: 15, z: 0 })
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
