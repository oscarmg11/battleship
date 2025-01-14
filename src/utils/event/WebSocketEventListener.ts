import { EventListener } from '@/utils/event/EventListener.ts'
import * as THREE from 'three'
import { Point } from '@/game/types/Point.ts'
import { GameVm } from '@/types/GameVm.js'
import { SessionVm } from '@/types/SessionVm.js'

export class WebSocketEventListener extends EventListener {

    static addEventListener(event: 'onGameCreated', fn: (game: GameVm) => void): () => void
    static addEventListener(event: 'onRivalConnected', fn: () => void): () => void
    static addEventListener(event: 'onRivalDisconnected', fn: () => void): () => void
    static addEventListener(event: 'onHostUpdated', fn: (event: { isHost: boolean }) => void): () => void
    static addEventListener(event: 'onSessionInfo', fn: (session: SessionVm) => void): () => void
    static addEventListener(event: WebSocketEvent, fn: (data: any) => void) {
        return super.addEventListener(event, fn)
    }

    static updateEventListener(event: 'onGameCreated', game: GameVm): void
    static updateEventListener(event: 'onRivalConnected'): void
    static updateEventListener(event: 'onRivalDisconnected'): void
    static updateEventListener(event: 'onSessionInfo', session: SessionVm): void
    static updateEventListener(event: WebSocketEvent, data?: any) {
        super.updateEventListener(event, data)
    }
}

export type WebSocketEvent = 'onRivalConnected' | 'onRivalDisconnected' | 'onGameCreated' | 'onSessionInfo' | 'onHostUpdated'
