import * as THREE from 'three'
import { createArray } from '@/utils/array/createArray'
// @ts-ignore
import { Line2 } from 'three/addons/lines/Line2.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { Ship } from '@/game/Ship.ts'
import { CellStatus, CellStatuses } from '@/constants/CellStatus.ts'
import { setCursorType } from '@/utils/dom/setCursorType.ts'

export class Board {
    private boxSize = 2
    private threeObjects: Array<Array<THREE.Mesh>> = []
    private threeObjectsLines: Array<Line2> = []
    private boardSize = 10
    private ships: Array<Ship>
    private cells: Array<Array<CellStatus>> = createArray(
        this.boardSize,
        createArray(this.boardSize, CellStatuses.EMPTY),
    )

    constructor(ships: Array<Ship>) {
        this.ships = ships
        this.initializeBoard()
        this.initializeShips()
    }

    private initializeBoard(){
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
        for (let i = -halfBoard + 1; i < halfBoard; i++) {
            this.threeObjects[i] = []
            for (let j = -halfBoard + 1; j < halfBoard; j++) {
                const cube = new THREE.Mesh(geometry, material)
                const cubeEdges = new Line2(lineGeometry, lineMaterial)

                cube.position.set(i, 0, j)
                cubeEdges.position.set(i, 0, j)

                this.threeObjects[i][j] = cube
                this.threeObjectsLines.push(cubeEdges)
            }
        }
    }

    private initializeShips() {
        for(let i = 0; i < this.ships.length; i++){
            const ship = this.ships[i]
            ship.setPosition({ x: - 6 - (ship.getSize() / 2) , y: 0, z: -3.5 + i + (i * 0.5)})
        }
    }

    toThreeObjects() {
        return [
            ...this.threeObjects.flatMap(object => object),
            ...this.threeObjectsLines,
            ...this.ships.map(ship => ship.getThreeObject()),
        ]
    }
}
