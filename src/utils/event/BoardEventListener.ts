import { EventListener } from '@/utils/event/EventListener.ts'
import * as THREE from 'three'
import { Point } from '@/types/Point.ts'

export class BoardEventListener extends EventListener {

    static addEventListener(event: 'onDropShip', fn: (data:number) => void): () => void
    static addEventListener(event: 'onDragShip', fn: (data:number) => void): () => void
    static addEventListener(event: Event, fn: (data: any) => void) {
        return super.addEventListener(event, fn)
    }

    static updateEventListener(event: 'onDropShip', data:number): void
    static updateEventListener(event: 'onDragShip', data:number): void
    static updateEventListener(event: Event, data: any) {
        super.updateEventListener(event, data)
    }
}

type Event = 'onDropShip' | 'onDragShip'
