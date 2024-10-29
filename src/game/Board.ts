import * as THREE from 'three'
import { createArray } from '@/utils/array/createArray'
// @ts-ignore
import { Line2 } from 'three/addons/lines/Line2.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { Ship } from '@/game/Ship.ts'
import { CellStatus, CellStatuses } from '@/game/board/constants/CellStatus.ts'
import { BoardEventListener } from '@/utils/event/BoardEventListener.ts'
import { create2DText } from '@/utils/text/create2DText.ts'
import { ShipCollisionValidator } from '@/game/ship/services/ShipCollisionValidator.ts'
import { ShipShapes } from '@/game/ship/constants/ShipShapes.ts'
import { translate } from '@/utils/text/translate.ts'
import { Point } from '@/game/types/Point.ts'

export class Board {
    private boxSize = 2
    protected threeGroup: THREE.Group
    private boardSize = 10
    private cells: Array<Array<CellStatus>> = createArray(
        this.boardSize,
        createArray(this.boardSize, CellStatuses.EMPTY),
    )

    constructor(boardCenter: Point) {
        this.threeGroup = new THREE.Group()
        this.initializeBoard(boardCenter)
    }

    private initializeBoard(boardCenter: Point){
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 0,
            transparent: true,
        })
        const geometry = new THREE.BoxGeometry(this.boxSize, 0, this.boxSize)

        const edgesPositions = [
            -(this.boxSize / 2),
            -0,
            this.boxSize / 2,
            -(this.boxSize / 2),
            -0,
            -(this.boxSize / 2),
            -(this.boxSize / 2),
            -0,
            -(this.boxSize / 2),
            this.boxSize / 2,
            -0,
            -(this.boxSize / 2),
            this.boxSize / 2,
            -0,
            -(this.boxSize / 2),
            this.boxSize / 2,
            -0,
            this.boxSize / 2,
            this.boxSize / 2,
            -0,
            this.boxSize / 2,
            -(this.boxSize / 2),
            -0,
            this.boxSize / 2,
        ]
        const lineGeometry = new LineGeometry()
        lineGeometry.setPositions(edgesPositions)

        const lineMaterial = new LineMaterial({
            color: 0xffffff,
            linewidth: 3,
            resolution: new THREE.Vector2(
                window.innerWidth,
                window.innerHeight,
            ),
        })

        const halfBoard  = Math.floor(this.boardSize/2)

        for (let i = -halfBoard + 1 + boardCenter.x; i < halfBoard + boardCenter.x; i++) {
            for (let j = -halfBoard + 1 + boardCenter.z; j < halfBoard + boardCenter.z; j++) {
                const cube = new THREE.Mesh(geometry, material)
                const cubeEdges = new Line2(lineGeometry, lineMaterial)

                cube.position.set(i, 0, j)
                cubeEdges.position.set(i, 0, j)

                this.threeGroup.add(cube)
                this.threeGroup.add(cubeEdges)
            }
        }

        let asciiLetter = 'A'.charCodeAt(0)
        const letterSize = 0.8
        for (let i = 0; i < this.boardSize; i++) {
            const letter = create2DText(String.fromCharCode(asciiLetter + i), { size: letterSize })
            letter.position.set(-halfBoard - 1, 0, i - halfBoard + 0.4 + boardCenter.z)

            const number = i +1
            const numberText = create2DText(number.toString(), { size: letterSize })
            numberText.position.set(i - halfBoard +  0.5 + boardCenter.x,0, -halfBoard - 1 + boardCenter.z)

            this.threeGroup.add(letter)
            this.threeGroup.add(numberText)
        }
    }

    toThreeObject() {
        return this.threeGroup
    }
}
