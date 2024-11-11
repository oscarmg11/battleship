import { EventListener } from '@/utils/event/EventListener.ts'
import * as THREE from 'three'
import { Point } from '@/game/types/Point.ts'
import { GameVm } from '@/types/GameVm.js'

export class WebSocketEventListener extends EventListener {

    static addEventListener(event: 'onGameCreated', fn: (game: GameVm) => void): () => void
    static addEventListener(event: 'onEnemyReady', fn: () => void): () => void
    static addEventListener(event: WebSocketEvent, fn: (data: any) => void) {
        return super.addEventListener(event, fn)
    }

    static updateEventListener(event: 'onGameCreated', game: GameVm): void
    static updateEventListener(event: 'onEnemyReady'): void
    static updateEventListener(event: WebSocketEvent, data?: any) {
        super.updateEventListener(event, data)
    }
}

export type WebSocketEvent = 'onEnemyReady' | 'onGameCreated'
