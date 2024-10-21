import type { ShipShape } from '@/constants/ShipShapes.ts'
import { ShipShapes } from '@/constants/ShipShapes.ts'
import { ShipRotation, ShipRotations } from '@/constants/ShipRotation.ts'
import * as THREE from 'three'
import { Point } from '@/types/Point.ts'
import { newId } from '@/utils/newId.ts'
import { setCursorType } from '@/utils/dom/setCursorType.ts'
import { ShipEventListener } from '@/utils/event/ShipEventListener.ts'
import { BoardEventListener } from '@/utils/event/BoardEventListener.ts'

export class Ship {
    private threeObject: THREE.Mesh
    private size
    private rotation: ShipRotation = ShipRotations.HORIZONTAL
    private id: number
    private isMouseOver = false
    private dragging = false
    private editing = false
    private editingEventListenerRemovers: Array<Function> = []

    constructor(shipShape: ShipShape) {
        this.size = this.getShipSize(shipShape)
        const material = new THREE.MeshStandardMaterial( {
            color: 0xffffff,
        } );
        const geometry = new THREE.BoxGeometry(this.size, 0.8, 0.8)
        const threeObject = new THREE.Mesh( geometry, material );
        this.threeObject = threeObject
        this.id = threeObject.id
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
    }

    startDragging() {
        if(!this.isMouseOver || !this.editing) return
        setCursorType('grabbing')
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
    }

    dragTo(point: Point) {
        if(!this.dragging || !this.editing) return
        const position = new THREE.Vector3(point.x, point.y, point.z)
        this.threeObject.position.copy(position);
    }

    setPosition(point: Point){
        this.threeObject.position.set(point.x, point.y, point.z)
    }

    getPosition(): Point{
        return {
            x: this.threeObject.position.x,
            y: this.threeObject.position.y,
            z: this.threeObject.position.z,
        }
    }

    rotate(){
        if(!this.editing) return
        this.rotation = this.rotation === ShipRotations.VERTICAL ? ShipRotations.HORIZONTAL : ShipRotations.VERTICAL
        this.threeObject.rotation.y = this.threeObject.rotation.y + (Math.PI / 2)
        BoardEventListener.updateEventListener('onDropShip', this.id)
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
        return this.id === id
    }

    toThreeObject(){
        return this.threeObject
    }
}
