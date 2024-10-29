import { Board } from '@/game/Board.ts'
import { create2DText } from '@/utils/text/create2DText.ts'
import { translate } from '@/utils/text/translate.ts'
import { ShipShapes } from '@/game/ship/constants/ShipShapes.ts'
import { Ship } from '@/game/Ship.ts'
import { ShipCollisionValidator } from '@/game/ship/services/ShipCollisionValidator.ts'
import { BoardEventListener } from '@/utils/event/BoardEventListener.ts'

export class MainBoard extends Board {
    private ships: Array<Ship>
    private shipIdsReady: Array<number> = []
    private editingEventListenerRemovers: Array<Function> = []

    constructor() {
        super({ x: 0, y: 0, z: 0 })
        const shipShapes = [ShipShapes.LONG, ShipShapes.MEDIUM, ShipShapes.SHORT, ShipShapes.SHORT, ShipShapes.SMALL]
        this.ships =  shipShapes.map(shipShape => new Ship(shipShape))
        this.initializeShips()
    }

    private initializeShips() {
        const shipsLabel = create2DText(translate('Your ships'), {  width: 10 })
        shipsLabel.position.set(-7.5, 0, -5.5)
        for(let i = 0; i < this.ships.length; i++){
            const ship = this.ships[i]
            ship.setPosition({ x: - 8 - (ship.getSize() / 2) , y: 0, z: -3.5 + i + (i * 0.5)})
        }
        this.threeGroup.add(shipsLabel)
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

        const markCollision = ShipCollisionValidator.markCollision.bind(ShipCollisionValidator);
        this.ships.forEach(markCollision)
        this.shipIdsReady.push(shipId)
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

    private areShipsReady() {
        return this.ships.every(ship => this.shipIdsReady.some(shipId => ship.isShip(shipId)))
    }

    private thereAreNoCollision() {
        const isColliding = ShipCollisionValidator.isColliding.bind(ShipCollisionValidator);
        return !this.ships.some(isColliding)
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

    isBoardReady() {
        return this.areShipsReady() && this.thereAreNoCollision()
    }

    getBoardErrorMessage() {
        if(!this.areShipsReady()) return translate('There are ships missing to place.')
        if(!this.thereAreNoCollision()) return translate('There are ships colliding.')
        return ''
    }

    toThreeObjects()  {
        return [
            super.toThreeObject(),
            ...this.ships.map(ship => ship.toThreeObject())
        ]
    }
}
