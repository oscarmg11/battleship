import { Board } from '@/game/Board.ts'

export class EnemyBoard extends Board {

    constructor() {
        super({ x: 0, y: 0, z: -15 })
    }

}
