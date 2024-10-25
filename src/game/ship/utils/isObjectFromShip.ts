import * as THREE from 'three'

export function isObjectFromShip(object: THREE.Object3D): boolean {
    return !!object.userData.isShip
}
