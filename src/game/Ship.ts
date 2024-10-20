import type { ShipShape } from '@/constants/ShipShapes.ts'
import { ShipShapes } from '@/constants/ShipShapes.ts'
import { ShipRotation, ShipRotations } from '@/constants/ShipRotation.ts'
import * as THREE from 'three'
import { Point } from '@/types/Point.ts'
import { newId } from '@/utils/newId.ts'

export class Ship {
    private threeObject: THREE.Mesh
    private size
    private rotation: ShipRotation = ShipRotations.VERTICAL
    private id: string

    constructor(shipShape: ShipShape) {
        this.size = this.getShipSize(shipShape)
        const material = new THREE.MeshStandardMaterial( {
            color: 0xffffff,
        } );
        const geometry = new THREE.BoxGeometry(this.size, 0.8, 0.8)
        this.threeObject = new THREE.Mesh( geometry, material );
        this.id = newId()
    }

    private getShipSize(shipShape: ShipShape): number {
        switch (shipShape) {
            case ShipShapes.LONG: return 5
            case ShipShapes.MEDIUM: return 4
            case ShipShapes.SHORT: return 3
            case ShipShapes.SMALL: return 2
            default: throw new Error(`shipShape=${shipShape} not supported`)
        }
    }

    setPosition(point: Point){
        this.threeObject.position.set(point.x, point.y, point.z)
    }

    getSize(){
        return this.size
    }

    isThreeObject(id: string){
        return this.threeObject.id === id
    }

    toThreeObject(){
        return this.threeObject
    }
}
