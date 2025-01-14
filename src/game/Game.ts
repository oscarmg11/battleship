import { scene } from '@/game/utils/Scene.ts'
import { camera } from '@/game/utils/Camera.ts'
import { MainBoard } from '@/game/MainBoard.ts'
import { EnemyBoard } from '@/game/EnemyBoard.ts'

class Game {
    private mainBoard: MainBoard
    private settingUp = false
    private disabled = true

    constructor() {
        const mainBoard = new MainBoard()
        const enemyBoard = new EnemyBoard()
        scene.addElements(mainBoard.toThreeObjects())
        scene.addElement(enemyBoard.toThreeObject())
        this.mainBoard = mainBoard
    }

    setupGame() {
        console.log('here inside class = ', this.disabled)
        if(this.disabled) return

        this.settingUp = true
        camera.moveTo({ x: 0, y: 15, z: 0 }, { x: 0, y: 0, z: 0})
        scene.addElementsToTrack(this.mainBoard.getShipElements() ?? [])
        this.mainBoard.startEditing()
    }

    isGameReadyToStart() {
        return this.mainBoard.isBoardReady()
    }

    getBoardErrorMessage() {
        return this.mainBoard.getBoardErrorMessage()
    }

    finishSetupGame() {
        this.settingUp = false
        camera.moveToInitialPosition()
        scene.clearElementsToTrack()
        this.mainBoard.endEditing()
    }

    enable() {
        this.disabled = false
    }

    disable() {
        this.disabled = true
    }

}

export const game = new Game()
