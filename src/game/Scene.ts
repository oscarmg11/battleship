import * as THREE from 'three'
import { isDev } from '@/utils/env/isDev.ts'
import { camera, Camera } from '@/game/Camera.ts'
import { Board } from '@/game/Board.ts'
import { Ship } from '@/game/Ship.ts'

export class Scene {
    private scene: THREE.Scene
    private width = window.innerWidth
    private height = window.innerHeight
    private mousePosition = new THREE.Vector2();
    private elementsToTrackPosition: Array<THREE.Object3D> = []

    constructor(camera: Camera) {
        const scene = new THREE.Scene()
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        const light = new THREE.AmbientLight( 0xffffff ); // soft white light
        scene.add( light );
        scene.add( directionalLight );

        const raycaster = new THREE.Raycaster();

        window.addEventListener('mousemove', this.trackMousePosition);

        if(isDev()){
            const axesHelper = new THREE.AxesHelper( 100 );
            axesHelper.setColors( new THREE.Color(0xff0000), new THREE.Color(0x00ff00), new THREE.Color(0x0000ff))
            scene.add(axesHelper)
        }

        const animate = () => {
            renderer.render(scene, camera.getThreeObject())
            raycaster.setFromCamera(this.mousePosition, camera);
        }

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(this.width, this.height)
        renderer.setAnimationLoop(animate)
        document.body.appendChild(renderer.domElement)

        this.scene = scene
    }

    addElement(element: THREE.Object3D){
        this.scene.add(element)
    }

    addElements(elements: Array<THREE.Object3D>){
        this.scene.add(...elements)
    }

    addElementsToTrack(elements: Array<THREE.Object3D>){
        this.elementsToTrackPosition.concat(elements)
    }

    private trackMousePosition(event: MouseEvent){
        this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
}

export const scene = new Scene(camera)
