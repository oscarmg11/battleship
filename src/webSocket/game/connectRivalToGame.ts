import { webSocket } from '@/webSocket/WebSocket.js'

export async function connectRivalToGame(gameId: string): Promise<void> {
    webSocket.sendEvent('connectRivalToGame', { gameId })
}
