import { scene } from '@/game/utils/Scene.ts'
import { Ship } from '@/game/Ship.ts'
import * as THREE from 'three'
import { isObjectFromShip } from '@/game/ship/utils/isObjectFromShip.ts'

export class ShipCollisionValidator {
    static checkCollision(ship: Ship): void {
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

        const threeScene = scene.toThreeObject()
        threeScene.children.forEach((objectInScene) => {
            if(!isObjectFromShip(objectInScene)) return
            if(objectsGroup.id === objectInScene.id) return

            const objectInSceneCollisionBox = new THREE.Box3().setFromObject(objectInScene).expandByVector(shrinkVector);

            for(const shipCollisionBox of shipCollisionBoxes) {
                if (shipCollisionBox.box.intersectsBox(objectInSceneCollisionBox)) {
                    ship.markObjectColliding(shipCollisionBox.id)
                }
            }

        });
    }
}

type ShipCollisionBox = {
    id: number;
    box: THREE.Box3
}
