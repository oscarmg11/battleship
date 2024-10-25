import * as THREE from 'three'
import { isDev } from '@/utils/env/isDev.ts'
import { camera, Camera } from '@/game/utils/Camera.ts'
import { ShipEventListener } from '@/utils/event/ShipEventListener.ts'

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

        const planeGeometry = new THREE.PlaneGeometry(100, 100);
        const planeMaterial = new THREE.MeshBasicMaterial({  visible: false });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.position.set(0,0,0)
        plane.rotation.x = -Math.PI / 2
        scene.add(plane);

        const raycaster = new THREE.Raycaster();

        window.addEventListener('mousemove', (event: MouseEvent) => {
            this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('dblclick', (event: MouseEvent) => {
            const mouse = new THREE.Vector2();
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera.toThreeObject());
            const intersects = raycaster.intersectObjects(this.elementsToTrackPosition);
            if(!intersects.length) return

            const objectsIntersected = intersects.map(intersect => intersect.object)

            ShipEventListener.updateEventListener('onClick', objectsIntersected[0].parent?.id!)
        });

        if(isDev()){
            const axesHelper = new THREE.AxesHelper( 100 );
            axesHelper.setColors( new THREE.Color(0xff0000), new THREE.Color(0x00ff00), new THREE.Color(0x0000ff))
            scene.add(axesHelper)
        }

        const animate = () => {
            renderer.render(scene, camera.toThreeObject())

            if(!this.elementsToTrackPosition.length) return

            raycaster.setFromCamera(this.mousePosition, camera.toThreeObject());

            const intersects = raycaster.intersectObjects(this.elementsToTrackPosition);
            const objectsIntersected = intersects.map(intersect => intersect.object)

            if(objectsIntersected.length) ShipEventListener.updateEventListener('onMouseOver', objectsIntersected[0].parent?.id!)
            else ShipEventListener.updateEventListener('onMouseLeave')

            const planeIntersects = raycaster.intersectObject(plane);
            if (planeIntersects.length) {
                const planeIntersectPoint = planeIntersects[0].point;
                ShipEventListener.updateEventListener('onMove', {
                    x: planeIntersectPoint.x,
                    y: planeIntersectPoint.y,
                    z: planeIntersectPoint.z,
                })
            }
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
        this.elementsToTrackPosition = this.elementsToTrackPosition.concat(elements)
    }

    clearElementsToTrack(){
        this.elementsToTrackPosition = []
    }

    toThreeObject(){
        return this.scene
    }
}

export const scene = new Scene(camera)
