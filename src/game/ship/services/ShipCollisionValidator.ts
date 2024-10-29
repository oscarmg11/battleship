import { scene } from '@/game/utils/Scene.ts'
import { Ship } from '@/game/Ship.ts'
import * as THREE from 'three'
import { isObjectFromShip } from '@/game/ship/utils/isObjectFromShip.ts'

export class ShipCollisionValidator {
    static getCollidingObjectIds(ship: Ship): Array<number> {
        const shrinkVector = new THREE.Vector3(-0.2, -0.2, -0.2)
        const objects = ship.toThreeObjects()
        const objectsGroup = ship.toThreeObject()

        const shipCollisionBoxes: Array<ShipCollisionBox> = objects.map(object => {
            const box = new THREE.Box3().setFromObject(object).expandByVector(shrinkVector)
            return {
                id: object.id,
                box: box
            }
        })

        const collidingObjectIds: Array<number> = []
        const threeScene = scene.toThreeObject()
        for(const objectInScene of threeScene.children) {
            if(!isObjectFromShip(objectInScene)) continue
            if(objectsGroup.id === objectInScene.id) continue

            const objectInSceneCollisionBox = new THREE.Box3().setFromObject(objectInScene).expandByVector(shrinkVector);

            for(const shipCollisionBox of shipCollisionBoxes) {
                if (shipCollisionBox.box.intersectsBox(objectInSceneCollisionBox)) {
                    collidingObjectIds.push(shipCollisionBox.id)
                }
            }
        }

        return collidingObjectIds
    }

    static isColliding(ship: Ship): boolean {
        return this.getCollidingObjectIds(ship).length > 0
    }

    static markCollision(ship: Ship): void {
        this.getCollidingObjectIds(ship).forEach((collidingObjectId) => {
            ship.markObjectColliding(collidingObjectId);
        })
    }
}

type ShipCollisionBox = {
    id: number;
    box: THREE.Box3
}
