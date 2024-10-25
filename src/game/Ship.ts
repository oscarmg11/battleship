import type { ShipShape } from '@/constants/ShipShapes.ts'
import { ShipShapes } from '@/constants/ShipShapes.ts'
import { ShipRotation, ShipRotations } from '@/constants/ShipRotation.ts'
import * as THREE from 'three'
import { Point } from '@/types/Point.ts'
import { newId } from '@/utils/newId.ts'
import { setCursorType } from '@/utils/dom/setCursorType.ts'
import { ShipEventListener } from '@/utils/event/ShipEventListener.ts'
import { BoardEventListener } from '@/utils/event/BoardEventListener.ts'
import { ShipEditionValidator } from '@/game/ship/services/ShipEditionValidator.ts'

export class Ship {
    private threeGroup: THREE.Group
    private size
    private rotation: ShipRotation = ShipRotations.HORIZONTAL
    private isMouseOver = false
    private dragging = false
    private editing = false
    private editingEventListenerRemovers: Array<Function> = []
    id: number

    constructor(shipShape: ShipShape) {
        this.size = this.getShipSize(shipShape)
        const material = new THREE.MeshStandardMaterial( {
            color: 0xffffff,
        });

        const boxSize = 1

        const group = new THREE.Group()
        const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize)
        group.userData = {
            isShip: true,
        }

        for(let i = -(this.size/2) + 0.5; i < (this.size/2); i++){
            const threeObject = new THREE.Mesh( geometry, material );
            threeObject.position.set(i * boxSize,0,0);
            group.add(threeObject)
        }

        this.threeGroup = group
        this.id = group.id
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

    clearCollisionMarks(){
        const material = new THREE.MeshStandardMaterial( {
            color: 0xffffff,
        });
        for(const object of this.threeGroup.children as Array<THREE.Mesh>) {
            object.material = material
            object.material.needsUpdate = true;
        }
    }

    startEditing() {
        this.editing = true
        const removeOnMouseOverListener = ShipEventListener.addEventListener('onMouseOver', (elementId: number) => {
            if(this.isShip(elementId)){
                this.mouseOver()
            }
        })
        this.editingEventListenerRemovers.push(removeOnMouseOverListener)

        const removeOnMouseLeaveListener = ShipEventListener.addEventListener('onMouseLeave', () => {
            this.mouseLeave()
        })
        this.editingEventListenerRemovers.push(removeOnMouseLeaveListener)

        const removeOnClickListener = ShipEventListener.addEventListener('onClick', (elementId: number) => {
            if(this.isShip(elementId)){
                this.rotate()
            }
        })
        this.editingEventListenerRemovers.push(removeOnClickListener)

        const removeOnMoveListener = ShipEventListener.addEventListener('onMove', (point: Point) => {
            this.dragTo(point)
        })
        this.editingEventListenerRemovers.push(removeOnMoveListener)

        const handleMouseDown = () => {
            this.startDragging()
        }
        const handleMouseUp = () => {
            this.endDragging()
        }
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)
        this.editingEventListenerRemovers.push(() => {
            window.removeEventListener('mousedown', handleMouseDown)
        })
        this.editingEventListenerRemovers.push(() => {
            window.removeEventListener('mouseup', handleMouseUp)
        })
    }

    endEditing() {
        this.editing = false
        this.editingEventListenerRemovers.forEach(editingEventListenerRemover => editingEventListenerRemover())
    }

    mouseOver() {
        if(!this.editing) return
        if(!this.dragging) setCursorType('grab')
        this.isMouseOver = true
        ShipEditionValidator.startEditing(this.id)
    }

    startDragging() {
        if(!this.isMouseOver || !this.editing) return
        if(!ShipEditionValidator.canEditShip(this.id)) return
        BoardEventListener.updateEventListener('onDragShip', this.id)
        setCursorType('grabbing')
        this.clearCollisionMarks()
        this.dragging = true
    }

    endDragging() {
        if(!this.dragging || !this.editing) return
        BoardEventListener.updateEventListener('onDropShip', this.id)
        setCursorType('grab')
        this.dragging = false
    }

    mouseLeave() {
        if(!this.isMouseOver || !this.editing) return
        setCursorType('default')
        this.isMouseOver = false
        ShipEditionValidator.endEditing()
    }

    dragTo(point: Point) {
        if(!this.dragging || !this.editing) return
        const position = new THREE.Vector3(point.x, point.y, point.z)
        this.threeGroup.position.copy(position);
    }

    setPosition(point: Point){
        this.threeGroup.position.set(point.x, point.y, point.z)
    }

    getPosition(): Point{
        return {
            x: this.threeGroup.position.x,
            y: this.threeGroup.position.y,
            z: this.threeGroup.position.z,
        }
    }

    rotate(){
        if(!this.editing) return
        this.rotation = this.rotation === ShipRotations.VERTICAL ? ShipRotations.HORIZONTAL : ShipRotations.VERTICAL
        this.threeGroup.rotation.y = this.threeGroup.rotation.y + (Math.PI / 2)
        BoardEventListener.updateEventListener('onDropShip', this.id)
    }

    markObjectColliding(id: number){
        const material = new THREE.MeshStandardMaterial( {
            color: 0xfa0202,
        });
        for(const object of this.threeGroup.children as Array<THREE.Mesh>) {
            if(object.id !== id) continue
            object.material = material
            object.material.needsUpdate = true;
        }
    }

    getSize(){
        return this.size
    }

    getWidth(){
        if(this.rotation === ShipRotations.VERTICAL) return 1
        return this.getSize()
    }

    getHeight(){
        if(this.rotation === ShipRotations.HORIZONTAL) return 1
        return this.getSize()
    }

    isShip(id: number){
        return id === this.id
    }

    toThreeObject(){
        return this.threeGroup
    }

    toThreeObjects(){
        return this.threeGroup.children
    }
}
