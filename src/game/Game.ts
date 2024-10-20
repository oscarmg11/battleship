import { Board } from '@/game/Board.ts'
import { Ship } from '@/game/Ship.ts'
import { scene } from '@/game/Scene.ts'

export class Game {
    private board: Board | undefined = undefined
    private ships: Array<Ship> = []

    constructor() {

    }

    addBoard(board: Board){
        this.board = board
        scene.addElements(board.toThreeObjects())
    }

    addShips(ships: Array<Ship>){
        this.ships.concat(ships)
        scene.addElementsToTrack(ships.map(ship => ship.toThreeObject()))
    }

}
