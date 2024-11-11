import { webSocket } from '@/webSocket/WebSocket.js'

export async function connectHostToGame(gameId: string): Promise<void> {
    webSocket.sendEvent('connectHostToGame', { gameId })
}
