import * as THREE from 'three'
import gsap from 'gsap';
import { Point } from '@/types/Point.ts'

export class Camera {
    private camera: THREE.PerspectiveCamera
    private lookAtPoint: Point = { x: 0, y: 0, z: 0}
    private initialPosition: Point = { x: 0, y: 10, z: 10}

    constructor() {
        const width = window.innerWidth,
            height = window.innerHeight

        const camera = new THREE.PerspectiveCamera(
            70,
            width / height,
            0.01,
            1000,
        )
        camera.position.set(this.initialPosition.x, this.initialPosition.y, this.initialPosition.z)
        camera.lookAt(this.lookAtPoint.x, this.lookAtPoint.y, this.lookAtPoint.z)
        camera.up.set(0, 1, 0);
        this.camera = camera

        document.addEventListener('keypress', ({ key }) => {
            if (key === 'w') camera.position.z += 0.1
            if (key === 's') camera.position.z -= 0.1
            if (key === 'a') camera.position.x += 0.1
            if (key === 'd') camera.position.x -= 0.1
        })
    }

    toThreeObject() {
        return this.camera
    }

    moveTo(to: Point, lookAt?: Point) {
        const lookAtPoint = lookAt ?? this.lookAtPoint
        gsap.to(this.camera.position, {
            duration: 2,
            x: to.x,
            y: to.y,
            z: to.z,
            ease: "power2.inOut",
            onUpdate: () => {
                this.camera.lookAt(lookAtPoint.x, lookAtPoint.y, lookAtPoint.z);
            },
            onComplete: () => {
                this.lookAtPoint = lookAtPoint
            }
        });
    }

    moveToInitialPosition(lookAt?: Point) {
        this.moveTo(this.initialPosition, lookAt)
    }
}

export const camera = new Camera()
