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

export class Board {
    private boxSize = 2
    private threeGroup: THREE.Group
    private boardSize = 10
    private ships: Array<Ship>
    private editingEventListenerRemovers: Array<Function> = []
    private cells: Array<Array<CellStatus>> = createArray(
        this.boardSize,
        createArray(this.boardSize, CellStatuses.EMPTY),
    )

    constructor() {
        const shipShapes = [ShipShapes.LONG, ShipShapes.MEDIUM, ShipShapes.SHORT, ShipShapes.SHORT, ShipShapes.SMALL]
        this.ships =  shipShapes.map(shipShape => new Ship(shipShape))
        this.threeGroup = new THREE.Group()
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
            for (let j = -halfBoard + 1; j < halfBoard; j++) {
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
        for (let i =0; i < this.boardSize; i++) {
            const letter = create2DText(String.fromCharCode(asciiLetter + i), { size: letterSize })
            letter.position.set(-halfBoard - 1, 0, i - halfBoard + 0.4)

            const number = i +1
            const numberText = create2DText(number.toString(), { size: letterSize })
            numberText.position.set(i - halfBoard +  0.5,0, -halfBoard - 1)

            this.threeGroup.add(letter)
            this.threeGroup.add(numberText)
        }
    }

    private initializeShips() {
        for(let i = 0; i < this.ships.length; i++){
            const ship = this.ships[i]
            ship.setPosition({ x: - 8 - (ship.getSize() / 2) , y: 0, z: -3.5 + i + (i * 0.5)})
        }
    }

    private fitShip(shipId: number) {
        const ship = this.ships.find(ship => ship.isShip(shipId))
        if(!ship) return

        this.ships.forEach(ship => ship.clearCollisionMarks())

        const shipPosition = ship.getPosition()
        const nearestPosition = {
            x: Math.round(shipPosition.x),
            y: ship.getPosition().y,
            z: Math.round(shipPosition.z),
        }

        const shipNeedsXOffset = ship.getWidth() % 2 !== 0
        const shipNeedsZOffset = ship.getHeight() % 2 !== 0

        let offsetX = 0
        let offsetZ = 0
        if(shipNeedsXOffset) {
            offsetX = shipPosition.x < nearestPosition.x ? -0.5 : 0.5
        }
        if(shipNeedsZOffset) {
            offsetZ = shipPosition.z < nearestPosition.z ? -0.5 : 0.5
        }

        ship.setPosition({
            x: this.formatShipXPosition(ship, nearestPosition.x + offsetX),
            y: ship.getPosition().y,
            z: this.formatShipZPosition(ship, nearestPosition.z + offsetZ),
        })

        this.ships.forEach(ShipCollisionValidator.checkCollision)
    }

    private formatShipXPosition(ship: Ship, position: number) {
        const width = ship.getWidth()
        if((position - (width / 2)) < -5) return -5 + (width / 2)
        if((position + (width / 2)) > 5) return 5 - (width / 2)
        return position
    }

    private formatShipZPosition(ship: Ship, position: number) {
        const height = ship.getHeight()
        if((position - (height / 2)) < -5) return -5 + (height / 2)
        if((position + (height /2)) > 5) return 5 - (height / 2)
        return position
    }

    startEditing() {
        this.ships.forEach(ship => ship.startEditing())
        const removeOnDropShipListener = BoardEventListener.addEventListener('onDropShip', (shipId: number) => {
           this.fitShip(shipId);
        })
        const removeOnDragShipListener = BoardEventListener.addEventListener('onDragShip', (shipId: number) => {
        })
        this.editingEventListenerRemovers.push(removeOnDropShipListener)
        this.editingEventListenerRemovers.push(removeOnDragShipListener)
    }

    endEditing() {
        this.ships.forEach(ship => ship.endEditing())
        this.editingEventListenerRemovers.forEach(editingEventListenerRemover => editingEventListenerRemover())
    }

    getShipElements() {
        return this.ships.map(ship => ship.toThreeObject())
    }

    toThreeObjects() {
        return [
            this.threeGroup,
            ...this.ships.map(ship => ship.toThreeObject())
        ]
    }
}
