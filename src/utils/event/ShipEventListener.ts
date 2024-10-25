import { EventListener } from '@/utils/event/EventListener.ts'
import * as THREE from 'three'
import { Point } from '@/game/types/Point.ts'

export class ShipEventListener extends EventListener {

    static addEventListener(event: 'onMouseOver', fn: (data: number) => void): () => void
    static addEventListener(event: 'onMouseLeave', fn: () => void): () => void
    static addEventListener(event: 'onClick', fn: (data: number) => void): () => void
    static addEventListener(event: 'onMove', fn: (data: Point) => void): () => void
    static addEventListener(event: Event, fn: (data?: any) => void) {
        return super.addEventListener(event, fn)
    }

    static updateEventListener(event: 'onMouseOver', data: number): void
    static updateEventListener(event: 'onMouseLeave'): void
    static updateEventListener(event: 'onClick', data: number): void
    static updateEventListener(event: 'onMove', data: Point): void
    static updateEventListener(event: Event, data?: any) {
        super.updateEventListener(event, data)
    }
}

type Event = 'onMouseOver' | 'onMouseLeave' | 'onMove' | 'onClick'
