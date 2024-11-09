import { EventListener } from '@/utils/event/EventListener.ts'
import * as THREE from 'three'
import { Point } from '@/game/types/Point.ts'

export class WebSocketEventListener extends EventListener {

    static addEventListener(event: 'onEnemyReady', fn: () => void): () => void
    static addEventListener(event: Event, fn: (data: any) => void) {
        return super.addEventListener(event, fn)
    }

    static updateEventListener(event: 'onEnemyReady'): void
    static updateEventListener(event: Event, data?: any) {
        super.updateEventListener(event, data)
    }
}

type Event = 'onEnemyReady'
